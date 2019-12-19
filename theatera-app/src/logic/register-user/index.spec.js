require('dotenv').config()
const { env: { TEST_DB_URL, SALT } } = process
const bcrypt = require('bcryptjs')
const { expect } = require('chai')
const registerUser = require('.')
const { random } = Math
const { errors: { ContentError } } = require('theatera-util')
const { database, models: { User } } = require('theatera-data')

describe('logic - register user', () => {
    before(() => database.connect(TEST_DB_URL))

    let name, email, password, isCompany

    beforeEach(() => {
        name = `name-${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
        isCompany = true

        return User.deleteMany()
    })

    it('should succeed on correct credentials', async() => {
        const response = await registerUser(name, email, password, true)
        expect(response).to.be.undefined


        const user = await User.findOne({ email })

        const valid = await bcrypt.compare(password, user.password)

        expect(user).to.exist

        expect(user.name).to.equal(name)
        expect(user.email).to.equal(email)
        expect(valid).to.equal(true)
        expect(user.rol).to.equal('COMPANY')
        expect(user.image).to.be.equal("/home/martingarcia/bootcamp/colab/skylab-bootcamp-201909/staff/martin-garcia/theatera/theatera-api/data/users/defaultImage/profile.jpg")

    })

    describe('when user already exists', () => {
        beforeEach(() => User.create({ name, email, password, rol: 'COMPANY' }))

        it('should fail on already existing user', async() => {
            try {
                await registerUser(name, email, password, isCompany)

                throw Error('should not reach this point')
            } catch (error) {
                expect(error).to.exist

                expect(error.message).to.exist
                expect(typeof error.message).to.equal('string')
                expect(error.message.length).to.be.greaterThan(0)
                expect(error.message).to.equal(`user with email ${email} already exists`)
            }
        })
    })

    it('should fail on incorrect name, surname, email, password, or expression type and content', () => {
        expect(() => registerUser(1)).to.throw(TypeError, '1 is not a string')
        expect(() => registerUser(true)).to.throw(TypeError, 'true is not a string')
        expect(() => registerUser([])).to.throw(TypeError, ' is not a string')
        expect(() => registerUser({})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => registerUser(undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => registerUser(null)).to.throw(TypeError, 'null is not a string')

        expect(() => registerUser('')).to.throw(ContentError, 'name is empty or blank')
        expect(() => registerUser(' \t\r')).to.throw(ContentError, 'name is empty or blank')

        expect(() => registerUser(name, 1)).to.throw(TypeError, '1 is not a string')
        expect(() => registerUser(name, true)).to.throw(TypeError, 'true is not a string')
        expect(() => registerUser(name, [])).to.throw(TypeError, ' is not a string')
        expect(() => registerUser(name, {})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => registerUser(name, undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => registerUser(name, null)).to.throw(TypeError, 'null is not a string')

        expect(() => registerUser(name, '')).to.throw(ContentError, ' is not an e-mail')
        expect(() => registerUser(name, ' \t\r')).to.throw(ContentError, ' is not an e-mail')

        expect(() => registerUser(name, email, 1)).to.throw(TypeError, '1 is not a string')
        expect(() => registerUser(name, email, true)).to.throw(TypeError, 'true is not a string')
        expect(() => registerUser(name, email, [])).to.throw(TypeError, ' is not a string')
        expect(() => registerUser(name, email, {})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => registerUser(name, email, undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => registerUser(name, email, null)).to.throw(TypeError, 'null is not a string')

        expect(() => registerUser(name, email, '')).to.throw(ContentError, 'password is empty or blank')
        expect(() => registerUser(name, email, ' \t\r')).to.throw(ContentError, 'password is empty or blank')

        expect(() => registerUser(name, email, password, 1)).to.throw(TypeError, '1 is not a boolean')
        expect(() => registerUser(name, email, password, [])).to.throw(TypeError, ' is not a boolean')
        expect(() => registerUser(name, email, password, {})).to.throw(TypeError, '[object Object] is not a boolean')
        expect(() => registerUser(name, email, password, null)).to.throw(TypeError, 'null is not a boolean')

        expect(() => registerUser(name, email, password, '')).to.throw(TypeError, ' is not a boolean')
        expect(() => registerUser(name, email, password, ' \t\r')).to.throw(TypeError, ' is not a boolean')


    })

    // TODO other cases

    after(() => User.deleteMany().then(database.disconnect))
})