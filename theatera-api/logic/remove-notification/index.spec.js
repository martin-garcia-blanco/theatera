require('dotenv').config()
const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const { random } = Math
const removeNotification = require('.')
const { errors: { NotFoundError, ContentError } } = require('theatera-util')
const { ObjectId, database, models: { User, Notification } } = require('theatera-data')

describe('logic - removeNotification', () => {
    before(() => database.connect(TEST_DB_URL))

    let userId, notiId

    beforeEach(async() => {
        name = `name-${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
        random() > 0.5 ? rol = 'COMPANY' : rol = 'PERSON'

        body = `body-${random()}`
        date = new Date
        type = 'ARTICLE'
        const likes = []
        const comments = []



        await User.deleteMany()

        const user = await User.create({ name, email, password, rol })
        userId = user.id
        const noti = new Notification
        notiId= noti.id
        user.notifications.push(noti)
        await user.save()

    })

    it('Should succed on correct notification removing', async() => {
        const user = await User.findById(userId)
        expect(user.notifications.length===1).to.be.true

        await removeNotification(userId, notiId)

        const _user = await User.findById(userId)
        expect(_user.notifications.length===0).to.be.true
    })


     it('should fail on unexisting user', async() => {
        const userId = ObjectId().toString()

        try {
            await removeNotification(userId, notiId)
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            expect(error.message).to.equal(`user with id ${userId} not found`)
        }
    })

    it('should fail on incorrect userId and postId', () => {

        expect(() => removeNotification(1)).to.throw(TypeError, '1 is not a string')
        expect(() => removeNotification(true)).to.throw(TypeError, 'true is not a string')
        expect(() => removeNotification([])).to.throw(TypeError, ' is not a string')
        expect(() => removeNotification({})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => removeNotification(undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => removeNotification(null)).to.throw(TypeError, 'null is not a string')
        expect(() => removeNotification('')).to.throw(ContentError, 'userId is empty or blank')
        expect(() => removeNotification(' \t\r')).to.throw(ContentError, 'userId is empty or blank')

        expect(() => removeNotification(userId, 1)).to.throw(TypeError, '1 is not a string')
        expect(() => removeNotification(userId, true)).to.throw(TypeError, 'true is not a string')
        expect(() => removeNotification(userId, [])).to.throw(TypeError, ' is not a string')
        expect(() => removeNotification(userId, {})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => removeNotification(userId, undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => removeNotification(userId, null)).to.throw(TypeError, 'null is not a string')
        expect(() => removeNotification(userId, '')).to.throw(ContentError, 'notificationId is empty or blank')
        expect(() => removeNotification(userId, ' \t\r')).to.throw(ContentError, 'notificationId is empty or blank')
    }) 


    after(() => User.deleteMany().then(database.disconnect))

})