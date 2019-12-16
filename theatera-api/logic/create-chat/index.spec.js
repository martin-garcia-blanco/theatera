require('dotenv').config()
const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const { random } = Math
const createChat = require('.')
const { errors: { NotFoundError, ContentError } } = require('theatera-util')
const { ObjectId, database, models: { User, Chat } } = require('theatera-data')

describe('logic - retrieve-personal-info', () => {
    before(() => database.connect(TEST_DB_URL))

    let id, name, email, password, rol

    beforeEach(async() => {
        await User.deleteMany()

        //PERSON
        name = `name-${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
        rol = 'PERSON'

        const user1 = await User.create({ name, email, password, rol })
        id1 = user1.id

        const user2 = await User.create({ name, email, password, rol })
        id2 = user2.id

    })

    it('should succeed on correct user id', async() => {
        const chatId = await createChat(id1, id2)

        expect(chatId).to.exist
        expect(chatId).to.be.a('string')

        const chat = await Chat.findById(chatId)

        expect(chat.users.includes(id1)).to.be.true
        expect(chat.users.includes(id2)).to.be.true
    })

    it('should fail on wrong user id', async() => {

        const fakeId = ObjectId().toString()
        try {
            const chatId = await createChat(fakeId, id2)

            throw Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            expect(error.message).to.equal(`user with id ${fakeId} not found`)
        }
    })

    it('should fail on wrong user id', async() => {

        const fakeId = ObjectId().toString()
        try {
            const chatId = await createChat(id1, fakeId)

            throw Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            expect(error.message).to.equal(`user with id ${fakeId} not found`)
        }
    })


    it('should fail on incorrect name, surname, email, password, or expression type and content', () => {

        const fakeId = 'sadf'


        expect(() => createChat(1)).to.throw(TypeError, '1 is not a string')
        expect(() => createChat(true)).to.throw(TypeError, 'true is not a string')
        expect(() => createChat([])).to.throw(TypeError, ' is not a string')
        expect(() => createChat({})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => createChat(undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => createChat(null)).to.throw(TypeError, 'null is not a string')

        expect(() => createChat('')).to.throw(ContentError, 'userId1 is empty or blank')
        expect(() => createChat(' \t\r')).to.throw(ContentError, 'userId1 is empty or blank')
        expect(() => createChat(fakeId)).to.throw(ContentError, `${fakeId} is not a valid id`)



        expect(() => createChat(id1, 1)).to.throw(TypeError, '1 is not a string')
        expect(() => createChat(id1, true)).to.throw(TypeError, 'true is not a string')
        expect(() => createChat(id1, [])).to.throw(TypeError, ' is not a string')
        expect(() => createChat(id1, {})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => createChat(id1, undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => createChat(id1, null)).to.throw(TypeError, 'null is not a string')

        expect(() => createChat(id1, '')).to.throw(ContentError, 'userId2 is empty or blank')
        expect(() => createChat(id1, ' \t\r')).to.throw(ContentError, 'userId2 is empty or blank')
        expect(() => createChat(id1, fakeId)).to.throw(ContentError, `${fakeId} is not a valid id`)

    })


    after(() => Promise.all([User.deleteMany(), Chat.deleteMany()]).then(database.disconnect))
})