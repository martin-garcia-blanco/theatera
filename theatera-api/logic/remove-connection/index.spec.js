require('dotenv').config()
const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const { random } = Math
const removeConnection = require('.')
const { errors: { NotFoundError, ContentError } } = require('theatera-util')
const { ObjectId, database, models: { User, Post } } = require('theatera-data')

describe('logic - removeConnection', () => {
    before(() => database.connect(TEST_DB_URL))

    let user1Id, user2Id

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
        let user1 = await User.create({ name, email, password, rol })
        user1Id = user1.id
        user1_Id = user1._id

        let user2 = await User.create({ name, email, password, rol })
        user2Id = user2.id
        user2_Id = user2._id

        user1.connections.push(user2Id)
        user2.connections.push(user1Id)

        

    })

    it('Should succed removing connection', async() => {

        await removeConnection(user1Id, user2Id)


        const user1 = await User.findById(user1Id)
        const user2 = await User.findById(user2Id)
        expect(user1.connections.length==0).to.be.true
        expect(user2.connections.length===0).to.be.true
        

    })


    it('should fail on unexisting first user id ', async() => {
        const userId = ObjectId().toString()

        try {
            await removeConnection(userId, user2Id)
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            expect(error.message).to.equal(`user with id ${userId} not found`)
        }
    })

    it('should fail on unexisting second user id ', async() => {
        const userId = ObjectId().toString()

        try {
            await removeConnection(user1Id, userId)
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            expect(error.message).to.equal(`user with id ${userId} not found`)
        }
    })
 
    it('should fail on incorrect first and second users', () => {

        expect(() => removeConnection(1)).to.throw(TypeError, '1 is not a string')
        expect(() => removeConnection(true)).to.throw(TypeError, 'true is not a string')
        expect(() => removeConnection([])).to.throw(TypeError, ' is not a string')
        expect(() => removeConnection({})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => removeConnection(undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => removeConnection(null)).to.throw(TypeError, 'null is not a string')
        expect(() => removeConnection('')).to.throw(ContentError, 'ownerId is empty or blank')
        expect(() => removeConnection(' \t\r')).to.throw(ContentError, 'ownerId is empty or blank')

        expect(() => removeConnection(user1Id, 1)).to.throw(TypeError, '1 is not a string')
        expect(() => removeConnection(user1Id, true)).to.throw(TypeError, 'true is not a string')
        expect(() => removeConnection(user1Id, [])).to.throw(TypeError, ' is not a string')
        expect(() => removeConnection(user1Id, {})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => removeConnection(user1Id, undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => removeConnection(user1Id, null)).to.throw(TypeError, 'null is not a string')
        expect(() => removeConnection(user1Id, '')).to.throw(ContentError, 'userId is empty or blank')
        expect(() => removeConnection(user1Id, ' \t\r')).to.throw(ContentError, 'userId is empty or blank')
    })
 

    after(() => Promise.all([User.deleteMany(), Post.deleteMany()]).then(database.disconnect))

})