require('dotenv').config()
const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const { random } = Math
const retrieveUser = require('.')
const { errors: { NotFoundError } } = require('theatera-util')
const { database, models: { User } } = require('theatera-data')

describe('logic - retrieve user', () => {
    before(() => database.connect(TEST_DB_URL))

    let id, name, email, password, rol

    beforeEach(async() => {
        name = `name-${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
        rol = 'PERSON'
        const image = "/home/martingarcia/bootcamp/colab/skylab-bootcamp-201909/staff/martin-garcia/theatera/theatera-api/data/users/defaultImage/profile.jpg"


        await User.deleteMany()

        const user = await User.create({ name, email, password, rol, image })

        id = user.id
    })

    it('should succeed on correct user id', async() => {
        const user = await retrieveUser(id)

        expect(user).to.exist
        expect(user.id).to.equal(id)
        expect(user.id).to.be.a('string')
        expect(user._id).to.not.exist
        expect(user.name).to.equal(name)
        expect(user.name).to.be.a('string')
        expect(user.email).to.equal(email)
        expect(user.email).to.be.a('string')
        expect(user.password).to.be.undefined
        expect(user.image.includes("/home/martingarcia/bootcamp/colab/skylab-bootcamp-201909/staff/martin-garcia/theatera/theatera-api/data/users/")).to.be.true

        /* expect(user.lastAccess).to.exist
        expect(user.lastAccess).to.be.an.instanceOf(Date) */
    })

    it('should fail on wrong user id', async() => {
        const id = '012345678901234567890123'

        try {
            await retrieveUser(id)

            throw Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            expect(error.message).to.equal(`user with id ${id} not found`)
        }
    })

    // TODO other cases

    after(() => User.deleteMany().then(database.disconnect))
})