require('dotenv').config()
const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const { random } = Math
const retrieveCompleteUser = require('.')
const { errors: { NotFoundError, ContentError } } = require('theatera-util')
const { database, models: { User, Person } } = require('theatera-data')

describe('logic - retrieve-complete-user', () => {
    before(() => database.connect(TEST_DB_URL))

    let id1, id2, name, email, password, rol, img, introduction, city, description, skills, experience, surname

    beforeEach(async() => {
        name = `name-${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
        introduction = `introduction-${random()}`
        description = `description-${random()}`
        description = description.slice(0, 140)
        city = `city-${random()}`
        skills
        const image = "/home/martingarcia/bootcamp/colab/skylab-bootcamp-201909/staff/martin-garcia/theatera/theatera-api/data/users/defaultImage/profile.jpg"


        await User.deleteMany()

        surname = `surname-${random()}`
        let specificInfo = await Person.create({ surname })
        const user = await User.create({ name, email, password, rol, introduction, specificInfo, image, rol: 'PERSON' })
        id1 = user.id

        specificInfo = await Person.create({})
        const company = await User.create({ name, email, password, rol, image, specificInfo, rol: 'COMPANY' })
        id2 = company.id
    })

    it('should succeed on correct user id, PERSON', async() => {
        const user = await retrieveCompleteUser(id1)
        let _intro
        user.introduction.length > 20 ? _intro = introduction.slice(0, 20) + '...' : _intro = ""

        expect(user).to.exist
        expect(user.id).to.equal(id1)
        expect(user.id).to.be.a('string')
        expect(user._id).to.not.exist
        expect(user.name).to.equal(name)
        expect(user.name).to.be.a('string')
        expect(user.password).to.be.undefined
        expect(user.introduction).to.equal(_intro)
        expect(user.introduction).to.be.a('string')
        expect(user.image.includes("/home/martingarcia/bootcamp/colab/skylab-bootcamp-201909/staff/martin-garcia/theatera/theatera-api/data/users/")).to.be.true


        if (rol === 'PERSON')
            expect(user.surname).to.be.equal(surname)

        /* img test? */

    })


    it('should succeed on correct user id, COMPANY', async() => {
        const user = await retrieveCompleteUser(id2)
        let _intro

        user.introduction.length > 20 ? _intro = introduction.slice(0, 20) + '...' : _intro = ''

        expect(user).to.exist
        expect(user.id).to.equal(id2)
        expect(user.id).to.be.a('string')
        expect(user._id).to.not.exist
        expect(user.name).to.equal(name)
        expect(user.name).to.be.a('string')
        expect(user.password).to.be.undefined
        expect(user.introduction).to.equal(_intro)
        expect(user.introduction).to.be.a('string')
        expect(user.image.includes("/home/martingarcia/bootcamp/colab/skylab-bootcamp-201909/staff/martin-garcia/theatera/theatera-api/data/users/")).to.be.true


        if (rol === 'PERSON')
            expect(user.surname).to.be.equal(surname)

        /* img test? */

    })

    it('should fail on wrong user id', async() => {
        const id = '012345678901234567890123'

        try {
            await retrieveCompleteUser(id)

            throw Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            expect(error.message).to.equal(`user with id ${id} not found`)
        }
    })


    it('should fail on incorrect userId and postId', () => {

        const fakeId = 'sadf'

        expect(() => retrieveCompleteUser(1)).to.throw(TypeError, '1 is not a string')
        expect(() => retrieveCompleteUser(true)).to.throw(TypeError, 'true is not a string')
        expect(() => retrieveCompleteUser([])).to.throw(TypeError, ' is not a string')
        expect(() => retrieveCompleteUser({})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => retrieveCompleteUser(undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => retrieveCompleteUser(null)).to.throw(TypeError, 'null is not a string')
        expect(() => retrieveCompleteUser('')).to.throw(ContentError, 'id is empty or blank')
        expect(() => retrieveCompleteUser(' \t\r')).to.throw(ContentError, 'id is empty or blank')
        expect(() => retrieveCompleteUser(fakeId)).to.throw(ContentError, `${fakeId} is not a valid id`)


    })


    after(() => User.deleteMany().then(database.disconnect))
})