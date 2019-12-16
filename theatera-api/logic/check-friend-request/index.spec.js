require('dotenv').config()
const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const { random } = Math
const checkFriendRequest = require('.')
const { errors: { NotFoundError, ContentError } } = require('theatera-util')
const { ObjectId, database, models: { User, FriendRequest } } = require('theatera-data')



describe('logic - checkFriendRequest', () => {
    before(() => database.connect(TEST_DB_URL))

    let id, name, email, friendId, friendName, friendEmail, introduction

    before(async() => {
        name = `name-${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
        introduction = `introduction-${random()}`
        random() > 0.5 ? rol = 'PERSON' : rol = 'COMPANY'

        friendName = `name-${random()}`
        friendEmail = `email-${random()}@mail.com`
        friendPassword = `password-${random()}`
        random() > 0.5 ? friendRol = 'PERSON' : friendRol = 'COMPANY'
        friendIntroduction = `introduction-${random()}`


        await Promise.all([User.deleteMany(), FriendRequest.deleteMany()])
        const user = await User.create({ name, email, password, rol, introduction })
        const friend = await User.create({ name: friendName, email: friendEmail, password: friendPassword, rol: friendRol, introduction: friendIntroduction })

        id = user.id
        friendId = friend.id

    })



    it('should succeed on initial step into the handshake, request from user to friend', async() => {
        const friendRequestId = await checkFriendRequest(id, friendId)
        const friendRequest = await FriendRequest.findOne({ "creator": ObjectId(id) })

        expect(friendRequestId).to.exist
        expect(friendRequestId).to.be.a('string')
        expect(friendRequestId).to.have.length.greaterThan(0)

        expect(friendRequest).to.exist
        expect(friendRequest.creator._id.toString()).to.be.equal(id)
        expect(friendRequest.receiver._id.toString()).to.be.equal(friendId)
    })


    it('repeat friendRequest from user to friend', async() => {
        const friendRequestMessage = await checkFriendRequest(id, friendId)
        const friendRequest = await FriendRequest.findOne({ "creator": ObjectId(id) })
        const allFriendRequests = await FriendRequest.find()

        expect(friendRequestMessage).to.exist
        expect(friendRequestMessage).to.be.a('string')
        expect(friendRequestMessage).to.have.length.greaterThan(0)
        expect(friendRequestMessage).to.be.equal('Still waiting for confirmation')



        expect(friendRequest).to.exist
        expect(friendRequest.creator._id.toString()).to.be.equal(id)
        expect(friendRequest.receiver._id.toString()).to.be.equal(friendId)

        expect(friendRequest).to.exist
        expect(friendRequest.creator._id.toString()).to.be.equal(id)
        expect(friendRequest.receiver._id.toString()).to.be.equal(friendId)

        expect(allFriendRequests.length).to.be.equal(1)
    })


    it('friendRequest from friend to user, so they are going to get connected after friendRequest', async() => {

        const friendRequestMessage = await checkFriendRequest(friendId, id)
        const allFriendRequests = await FriendRequest.find()

        const _user = await User.findById(id)
        const _friend = await User.findById(friendId)
        expect(_user.connections.length).to.be.equal(1)
        expect(_user.connections[0]._id.toString()).to.be.equal(_friend.id)

        expect(_friend.connections.length).to.be.equal(1)
        expect(_friend.connections[0]._id.toString()).to.be.equal(_user.id)

        expect(allFriendRequests.length).to.be.equal(0)
    })

    it('should fail on incorrect emitter objectId', async() => {
        const wrongUserId = `userId-${random()}`

        try {
            await checkFriendRequest(wrongUserId, friendId)
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(ContentError)
            expect(error.message).to.equal(`${wrongUserId} is not a valid id`)
        }

    })

    it('should fail on incorrect receiver objectId', async() => {
        const wrongUserId = `userId-${random()}`

        try {
            await checkFriendRequest(friendId, wrongUserId)
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(ContentError)
            expect(error.message).to.equal(`${wrongUserId} is not a valid id`)
        }

    })


    it('should fail on notFound receiver objectId', async() => {
        const wrongUserId = "5de05f690f3ed472bea9d9bf"

        try {
            await checkFriendRequest(friendId, wrongUserId)
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            expect(error.message).to.equal(`user with id ${wrongUserId} not found`)

        }

    })


    it('should fail on notFound emitter objectId', async() => {
        const wrongUserId = "5de05f690f3ed472bea9d9bf"

        try {
            await checkFriendRequest(wrongUserId, friendId)
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            expect(error.message).to.equal(`user with id ${wrongUserId} not found`)
        }

    })




    it('should fail on incorrect userId and postId', () => {

        const fakeId = 'sadf'

        expect(() => checkFriendRequest(1)).to.throw(TypeError, '1 is not a string')
        expect(() => checkFriendRequest(true)).to.throw(TypeError, 'true is not a string')
        expect(() => checkFriendRequest([])).to.throw(TypeError, ' is not a string')
        expect(() => checkFriendRequest({})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => checkFriendRequest(undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => checkFriendRequest(null)).to.throw(TypeError, 'null is not a string')
        expect(() => checkFriendRequest('')).to.throw(ContentError, 'emiterId is empty or blank')
        expect(() => checkFriendRequest(' \t\r')).to.throw(ContentError, 'emiterId is empty or blank')
        expect(() => checkFriendRequest(fakeId)).to.throw(ContentError, `${fakeId} is not a valid id`)

        expect(() => checkFriendRequest(friendId, 1)).to.throw(TypeError, '1 is not a string')
        expect(() => checkFriendRequest(friendId, true)).to.throw(TypeError, 'true is not a string')
        expect(() => checkFriendRequest(friendId, [])).to.throw(TypeError, ' is not a string')
        expect(() => checkFriendRequest(friendId, {})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => checkFriendRequest(friendId, undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => checkFriendRequest(friendId, null)).to.throw(TypeError, 'null is not a string')
        expect(() => checkFriendRequest(friendId, '')).to.throw(ContentError, 'receiverId is empty or blank')
        expect(() => checkFriendRequest(friendId, ' \t\r')).to.throw(ContentError, 'receiverId is empty or blank')
        expect(() => checkFriendRequest(friendId, fakeId)).to.throw(ContentError, `${fakeId} is not a valid id`)


    })



    after(() => Promise.all([User.deleteMany(), FriendRequest.deleteMany()]).then(database.disconnect))
})