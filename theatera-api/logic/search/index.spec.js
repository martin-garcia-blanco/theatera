require('dotenv').config()
const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const { random } = Math
const search = require('.')
const { errors: { ContentError } } = require('theatera-util')
const { database, models: { User } } = require('theatera-data')

describe('logic - search', () => {
    before(() => database.connect(TEST_DB_URL))

    let id1, id2, name, email, password, rol, searchedText

    beforeEach(async() => {
        name1 = 'pepe'
        searchedText = 'pepe'
        name2 = 'ana'
        surname = 'pepe'
        nameRandom = `name-${random()}`
        introduction = `introduction-${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
        rol = 'PERSON'
        specificInfo = {}

        await User.deleteMany()

        const user1 = await User.create({ name: name1, email, password, rol, introduction, specificInfo })
        id1 = user1.id

        const user2 = await User.create({ name: name2, email, password, rol, introduction, specificInfo: { surname } })
        id2 = user2.id

        const user3 = await User.create({ name: name2, email, password, rol, introduction, specificInfo })
        id3 = user3.id
    })

    it('should succeed on correct user id', async() => {
        const users = await search(id2,searchedText)

        expect(users).to.exist
        expect(users.length).to.be.equal(1)
        users.forEach(user => {
            expect(user.name === searchedText).to.be.true
        })


    })

    it('should fail on incorrect name, surname, email, password, or expression type and content', () => {
       
       expect(() => search(1)).to.throw(TypeError, '1 is not a string')
        expect(() => search(true)).to.throw(TypeError, 'true is not a string')
        expect(() => search([])).to.throw(TypeError, ' is not a string')
        expect(() => search({})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => search(undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => search(null)).to.throw(TypeError, 'null is not a string')
       
        expect(() => search(id1,1)).to.throw(TypeError, '1 is not a string')
        expect(() => search(id1,true)).to.throw(TypeError, 'true is not a string')
        expect(() => search(id1,[])).to.throw(TypeError, ' is not a string')
        expect(() => search(id1,{})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => search(id1,undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => search(id1,null)).to.throw(TypeError, 'null is not a string')
    })
    after(() => User.deleteMany().then(database.disconnect))
})