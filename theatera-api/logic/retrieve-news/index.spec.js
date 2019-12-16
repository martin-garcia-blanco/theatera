require('dotenv').config()
const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const { random } = Math
const retrieveNews = require('.')
const { errors: { NotFoundError, ContentError } } = require('theatera-util')
const { ObjectId, database, models: { User, Notification } } = require('theatera-data')



describe('logic - retrieveNews', () => {
    before(() => database.connect(TEST_DB_URL))

    let id1, id2, notificationId, name, email, password, rol, text

    beforeEach(async() => {
        name = `name-${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
        rol = 'PERSON'

        await User.deleteMany()

        user1 = await User.create({ name, email, password, rol })
        id1 = user1.id

        name = `name-${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
        rol = 'COMPANY'

        user2 = await User.create({ name, email, password, rol })
        id2 = user2.id

        text = "this is a new"
        const notification = new Notification({ body: { text } })
        notificationId = notification.id

        user1.notifications.push(notification)

        await user1.save()
    })



    it('should succeed on array of news', async() => {

        const news = await retrieveNews(id1)
        const _new = news[0]

        expect(_new.id).to.exist
        expect(_new.id).to.be.a('string')
        expect(_new.id).to.have.length.greaterThan(0)
        expect(_new.id).to.be.equal(notificationId)

        expect(_new.body.text).to.exist
        expect(_new.body.text).to.be.a('string')
        expect(_new.body.text).to.have.length.greaterThan(0)
        expect(_new.body.text).to.be.equal(text)
    })

    it('should succeed on user without friend', async() => {
        const news = await retrieveNews(id2)
        expect(news.length).to.be.equal(0)

    })

    it('should throw an NotFoundError because user doesnt exist', async() => {
        const fakeId = ObjectId().toString()
        try {
            const chatId = await retrieveNews(fakeId)

            throw Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            expect(error.message).to.equal(`user with id ${fakeId} not found`)
        }
    })



    it('should fail on incorrect name, surname, email, password, or expression type and content', () => {

        expect(() => retrieveNews(1)).to.throw(TypeError, '1 is not a string')
        expect(() => retrieveNews(true)).to.throw(TypeError, 'true is not a string')
        expect(() => retrieveNews([])).to.throw(TypeError, ' is not a string')
        expect(() => retrieveNews({})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => retrieveNews(undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => retrieveNews(null)).to.throw(TypeError, 'null is not a string')
        expect(() => retrieveNews('')).to.throw(ContentError, 'userId is empty or blank')
        expect(() => retrieveNews(' \t\r')).to.throw(ContentError, 'userId is empty or blank')

    })

    after(() => User.deleteMany().then(database.disconnect))

})