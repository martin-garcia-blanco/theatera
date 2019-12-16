require('dotenv').config()
const { env: { TEST_DB_URL, SALT } } = process
const { expect } = require('chai')
const authenticateUser = require('.')
const { random } = Math
const { errors: { ContentError, CredentialsError } } = require('theatera-util')
const { database, models: { User } } = require('theatera-data')
const bcrypt = require('bcryptjs')

describe('logic - authenticate user', () => {
    before(() => database.connect(TEST_DB_URL))

    let id, name, email, password, rol, hash

    beforeEach(async() => {
        name = `name-${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
        hash = await bcrypt.hash(password, parseInt(SALT));
        rol = 'COMPANY'

        await User.deleteMany()

        const user = await User.create({ name, email, password: hash, rol })

        id = user.id
    })

    it('should succeed on correct credentials', async() => {
        const userId = await authenticateUser(email, password)

        expect(userId).to.exist
        expect(typeof userId).to.equal('string')
        expect(userId.length).to.be.greaterThan(0)

        expect(userId).to.equal(id)
    })

    describe('when wrong credentials', () => {
        it('should fail on wrong email', async() => {
            const email = 'wrong'
            try {
                await authenticateUser(email, password)

                throw new Error('should not reach this point')
            } catch (error) {
                expect(error).to.exist
                expect(error).to.be.an.instanceOf(ContentError)
                const { message } = error

                expect(message).to.equal(`wrong is not an e-mail`)

            }
        })

        it('should fail on wrong email', async() => {
            const email = 'wrongasfd@asdf.com'
            try {
                await authenticateUser(email, password)

                throw new Error('should not reach this point')
            } catch (error) {
                expect(error).to.exist
                expect(error).to.be.an.instanceOf(CredentialsError)
                const { message } = error

                expect(message).to.equal(`wrong credentials`)

            }
        })


        it('should fail on wrong password', async() => {
            const password = 'wrong'
            try {
                await authenticateUser(email, password)

                throw new Error('should not reach this point')
            } catch (error) {
                expect(error).to.exist
                expect(error).to.be.an.instanceOf(CredentialsError)

                const { message } = error
                expect(message).to.equal(`wrong credentials`)
            }
        })
    })

    it('should fail on incorrect name, surname, email, password, or expression type and content', () => {
        expect(() => authenticateUser(1)).to.throw(TypeError, '1 is not a string')
        expect(() => authenticateUser(true)).to.throw(TypeError, 'true is not a string')
        expect(() => authenticateUser([])).to.throw(TypeError, ' is not a string')
        expect(() => authenticateUser({})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => authenticateUser(undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => authenticateUser(null)).to.throw(TypeError, 'null is not a string')

        expect(() => authenticateUser('')).to.throw(ContentError, 'email is empty or blank')
        expect(() => authenticateUser(' \t\r')).to.throw(ContentError, 'email is empty or blank')

        expect(() => authenticateUser(email, 1)).to.throw(TypeError, '1 is not a string')
        expect(() => authenticateUser(email, true)).to.throw(TypeError, 'true is not a string')
        expect(() => authenticateUser(email, [])).to.throw(TypeError, ' is not a string')
        expect(() => authenticateUser(email, {})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => authenticateUser(email, undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => authenticateUser(email, null)).to.throw(TypeError, 'null is not a string')

        expect(() => authenticateUser(email, '')).to.throw(ContentError, 'password is empty or blank')
        expect(() => authenticateUser(email, ' \t\r')).to.throw(ContentError, 'password is empty or blank')
    })

    // TODO other cases

    after(() => User.deleteMany().then(database.disconnect))
})