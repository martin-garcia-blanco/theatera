require('dotenv').config()
const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const { random } = Math
const retrieveConnections = require('.')
const { errors: { NotFoundError } } = require('theatera-util')
const { database, models: { User } } = require('theatera-data')



describe('logic - retrieveConnections', () => {
    before(() => database.connect(TEST_DB_URL))

    let id, name, email, type, friendId, friendName, friendEmail, friendType, introduction

    beforeEach(async() => {
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



        friendName1 = `name-${random()}`
        friendEmail1 = `email-${random()}@mail.com`
        friendPassword1 = `password-${random()}`
        random() > 0.5 ? friendRol1 = 'PERSON' : friendRol1 = 'COMPANY'

        await User.deleteMany()
        const user = await User.create({ name, email, password, rol, introduction })
        const friend = await User.create({ name: friendName, email: friendEmail, password: friendPassword, rol: friendRol, introduction: friendIntroduction })
        friendId = friend.id
        const friend1 = await User.create({ name: friendName1, email: friendEmail1, password: friendPassword1, rol: friendRol1 })
        user.connections.push(friend._id)
        user.connections.push(friend1._id)
        friend.connections.push(user._id)

        await user.save()
        id = user.id
        await friend.save()

    })



    it('should succeed on correct friend', async() => {

        const _friends = await retrieveConnections(friendId)

        const _friend = _friends[0]

        expect(_friend.id).to.exist
        expect(_friend.id).to.be.a('string')
        expect(_friend.id).to.have.length.greaterThan(0)
        expect(_friend.id).to.be.equal(id)

        expect(_friend.name).to.exist
        expect(_friend.name).to.be.a('string')
        expect(_friend.name).to.have.length.greaterThan(0)
        expect(_friend.name).to.be.equal(name)

        expect(_friend.introduction).to.exist
        expect(_friend.introduction).to.be.a('string')
        expect(_friend.introduction).to.have.length.greaterThan(0)
        expect(_friend.introduction).to.be.equal(introduction.slice(0, 40) + '...')
    })

    it('should succeed on user without friend', async() => {

        name = `name-${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
        random() > 0.5 ? rol = 'PERSON' : rol = 'COMPANY'
        const user3 = await User.create({ name, email, password, rol })

        const _friends = await retrieveConnections(user3.id)

        expect(_friends.length).to.be.equal(0)

    })


    after(() => User.deleteMany().then(database.disconnect))

})