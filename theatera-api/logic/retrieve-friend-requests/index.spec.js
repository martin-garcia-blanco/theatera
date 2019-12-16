require('dotenv').config()
const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const { random } = Math
const retrieveFriendRequest = require('.')
const { errors: { NotFoundError, ContentError } } = require('theatera-util')
const { OBjectId, database, models: { User, FriendRequest } } = require('theatera-data')

describe('logic - retrieveFriendRequest', () => {
    before(() => database.connect(TEST_DB_URL))

    let id1, name1, email1, password1, rol1

    beforeEach(async() => {
        name1 = `name-${random()}`
        email1 = `email-${random()}@mail.com`
        password1 = `password-${random()}`
        random() > 0.5 ? rol1 = 'COMPANY' : rol1 = 'PERSON'

        name2 = `name-${random()}`
        email2 = `email-${random()}@mail.com`
        password2 = `password-${random()}`
        random() > 0.5 ? rol2 = 'COMPANY' : rol2 = 'PERSON'

        name3 = `name-${random()}`
        email3 = `email-${random()}@mail.com`
        password3 = `password-${random()}`
        random() > 0.5 ? rol3 = 'COMPANY' : rol3 = 'PERSON'

        await Promise.all([User.deleteMany(), FriendRequest.deleteMany()])

        const user1 = await User.create({ name: name1, email: email1, password: password1, rol: rol1 })
        id1 = user1.id
        const user2 = await User.create({ name: name2, email: email2, password: password2, rol: rol2 })
        id2 = user2.id

        const user3 = await User.create({ name: name3, email: email3, password: password3, rol: rol3 })
        id3 = user3.id

        const friendRequest = await FriendRequest.create({ creator: user1._id, receiver: user2._id })
    })

    it('should succeed on more than 0 friendRequests ', async() => {
        const fr = await retrieveFriendRequest(id2)
        expect(fr.length).to.be.equal(1)
        expect(fr[0].id).to.be.equal(id1)
    })

    it('should succeed on 0 friendRequests ', async() => {
        const fr = await retrieveFriendRequest(id3)
        expect(fr.length).to.be.equal(0)
    })


    it('should fail on wrong user id', async() => {
        const id = '012345678901234567890123'

        try {
            await retrieveFriendRequest(id)

            throw Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            expect(error.message).to.equal(`user with id ${id} not found`)
        }
    })

    it('should fail on incorrect receiver objectId', async() => {
        const wrongUserId = `userId-${random()}`

        try {
            await retrieveFriendRequest(wrongUserId)
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(ContentError)
            expect(error.message).to.equal(`${wrongUserId} is not a valid id`)
        }

    })


    // TODO other cases

    after(() => User.deleteMany().then(database.disconnect))
})