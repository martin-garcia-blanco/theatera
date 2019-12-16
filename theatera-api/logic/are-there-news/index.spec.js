require('dotenv').config()
const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const { random } = Math
const areThereNews = require('.')
const { errors: { NotFoundError, ContentError } } = require('theatera-util')
const { ObjectId, database, models: { User, Notification } } = require('theatera-data')

describe('logic - areThereNews', () => {
    before(() => database.connect(TEST_DB_URL))

    let userId, noti1Id, noti2Id

    beforeEach(async() => {
        name = `name-${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
        random() > 0.5 ? rol = 'COMPANY' : rol = 'PERSON'

        title = `title-${random()}`
        body = `body-${random()}`
        dateEnd = new Date()
        dateStart = new Date()
        random() > 0.5 ? type = 'JOB' : type = 'EDUCATION'

        await User.deleteMany()
        let user = await User.create({ name, email, password, rol })
        userId = user.id
       
        const noti1 = await Notification.create({body:{},checked:true})
        noti1Id = noti1.id
        
        const noti2 = await Notification.create({body:{},checked:false})
        noti2Id = noti2.id
        user.notifications.push(noti1)
        user.notifications.push(noti2)

        await user.save()
    })

    it('Notifications Should be the same than the creation', async() => {

        await areThereNews(userId)

        user = await User.findById(userId)

        expect(user.notifications[0].checked===true).to.be.true
        expect(user.notifications[1].checked===false).to.be.true
    })


    it('Notifications Should be all true because of a fake retrieveNews', async() => {


        
        await User.findOneAndUpdate({_id: userId},
            { $set:{ "notifications.$[].checked" : true }})
            
            await areThereNews(userId)
            
        user = await User.findById(userId)


        expect(user.notifications[0].checked===true).to.be.true
        expect(user.notifications[1].checked===true).to.be.true
    })
 
    it('should fail on unexisting user ', async() => {
        const userId = ObjectId().toString()

        try {
            await areThereNews(userId)
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            expect(error.message).to.equal(`user with id ${userId} not found`)
        }
    })


    it('should fail on incorrect userId', () => {

        expect(() => areThereNews(1)).to.throw(TypeError, '1 is not a string')
        expect(() => areThereNews(true)).to.throw(TypeError, 'true is not a string')
        expect(() => areThereNews([])).to.throw(TypeError, ' is not a string')
        expect(() => areThereNews({})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => areThereNews(undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => areThereNews(null)).to.throw(TypeError, 'null is not a string')
        expect(() => areThereNews('')).to.throw(ContentError, 'userId is empty or blank')
        expect(() => areThereNews(' \t\r')).to.throw(ContentError, 'userId is empty or blank')

    })


    after(() => User.deleteMany().then(database.disconnect))

})