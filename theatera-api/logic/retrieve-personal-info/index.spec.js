require('dotenv').config()
const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const { random } = Math
const retrievePersonalInfo = require('.')
const { errors: { NotFoundError } } = require('theatera-util')
const { database, models: { User, Person } } = require('theatera-data')

describe('logic - retrieve-personal-info', () => {
    before(() => database.connect(TEST_DB_URL))

    let id, companyId, img, name, email, introduction, surname, description, gender, age, phone, website, city, languages, height, weight

    beforeEach(async() => {
        await User.deleteMany()

        //PERSON
        name = `name-${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
        personRol = 'PERSON'
        introduction = `introduction-${random()}`
        description = `description-${random()}`
        description = description.slice(0, 140)
        city = `city-${random()}`
        phone = `phone-${random()}`
        website = `website-${random()}`

        surname = `surname-${random()}`
        age = Math.floor(random() * 90)
        random() > 0.5 ? gender = 'MAN' : gender = 'WOMAN'
        languages = [`language-${random()}`, `language-${random()}`]
        height = random()
        weight = random()



        const personSpecificInfo = new Person({ surname, gender, age, weight, height, languages })
        const user = await User.create({ name, email, password, rol: personRol, introduction, description, city, phone, website, specificInfo: personSpecificInfo })
        id = user.id




        //Company
        companyRol = 'COMPANY'
        const companySpecificInfo = {}
        const company = await User.create({ name, email, password, rol: companyRol, introduction, description, city, phone, website, specificInfo: companySpecificInfo })
        companyId = company.id





    })

    it('should succeed on correct user id', async() => {
        const user = await retrievePersonalInfo(id)

        expect(user).to.exist
        expect(user.id).to.equal(id)
        expect(user.id).to.be.a('string')
        expect(user._id).to.not.exist
        expect(user.name).to.equal(name)
        expect(user.name).to.be.a('string')
        expect(user.password).to.be.undefined
        expect(user.introduction).to.equal(introduction)
        expect(user.introduction).to.be.a('string')
        expect(user.introduction).to.equal(introduction)
        expect(user.description).to.equal(description)
        expect(user.description).to.be.a('string')
        expect(user.website).to.equal(website)
        expect(user.website).to.be.a('string')
        expect(user.city).to.equal(city)
        expect(user.city).to.be.a('string')
        expect(user.email).to.equal(email)
        expect(user.email).to.be.a('string')


        if (user.rol === 'PERSON') {
            expect(user.specificInfo.surname).to.be.a('string')
            expect(user.specificInfo.surname).to.be.equal(surname)
            expect(user.specificInfo.gender).to.equal(gender)
            expect(user.specificInfo.gender).to.be.a('string')
            expect(user.specificInfo.age).to.equal(age)
            expect(user.specificInfo.age).to.be.a('number')
            expect(user.specificInfo.height).to.equal(height)
            expect(user.specificInfo.height).to.be.a('number')
            expect(user.specificInfo.weight).to.equal(weight)
            expect(user.specificInfo.weight).to.be.a('number')
        }
        /* img test? */

    })


    it('should succeed on correct user id', async() => {
        const company = await retrievePersonalInfo(companyId)

        if (company.rol === 'COMPANY') {
            expect(company).to.exist
            expect(company.id).to.equal(companyId)
            expect(company.id).to.be.a('string')
            expect(company._id).to.not.exist
            expect(company.name).to.equal(name)
            expect(company.name).to.be.a('string')
            expect(company.password).to.be.undefined
            expect(company.introduction).to.equal(introduction)
            expect(company.introduction).to.be.a('string')
            expect(company.introduction).to.equal(introduction)
            expect(company.description).to.equal(description)
            expect(company.description).to.be.a('string')
            expect(company.website).to.equal(website)
            expect(company.website).to.be.a('string')
            expect(company.city).to.equal(city)
            expect(company.city).to.be.a('string')
        }
    })



    it('should fail on wrong user id', async() => {
        const id = '012345678901234567890123'

        try {
            await retrievePersonalInfo(id)

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