require('dotenv').config()
const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const { random } = Math
const createExperienceItem = require('.')
const { errors: { NotFoundError } } = require('theatera-util')
const { database, models: { User, ExperienceItem } } = require('theatera-data')

describe('logic - createExperienceItem', () => {
    before(() => database.connect(TEST_DB_URL))

    let userId, title, dateStart, dateEnd, body, type

    beforeEach(async() => {
        name = `name-${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
        random() > 0.5 ? rol = 'COMPANY' : rol = 'PERSON'

        title = `title-${random()}`
        body = `body-${random()}`
        dateEnd = (new Date()).getTime()
        dateStart = (new Date()).getTime()
        random() > 0.5 ? type = 'JOB' : type = 'EDUCATION'



        await Promise.all([User.deleteMany(), ExperienceItem.deleteMany()])


        const user = await User.create({ name, email, password, rol })
        userId = user.id

    })

    it('Should succed on correct task', async() => {

        const experienceId = await createExperienceItem(userId, title, body, dateEnd, dateStart, type)
        let _user = await User.findById(userId)
        expect(experienceId).to.exist
        expect(experienceId).to.be.a('string')
        expect(experienceId).to.have.length.greaterThan(0)


        const experience = _user.experience.toObject()[0]

        expect(experience).to.exist

        expect(experience.title).to.exist
        expect(experience.title).to.be.a('string')
        expect(experience.title).to.have.length.greaterThan(0)
        expect(experience.title).to.be.equal(title)

        expect(experience.body).to.exist
        expect(experience.body).to.be.a('string')
        expect(experience.body).to.have.length.greaterThan(0)
        expect(experience.body).to.be.equal(body)

        expect(experience.endDate).to.be.a('number')
        expect(experience.endDate).to.exist
        expect(experience.endDate).to.be.equal(dateEnd)

        expect(experience.startDate).to.exist
        expect(experience.startDate).to.be.a('number')
        expect(experience.startDate).to.be.equal(dateStart)

    })



    after(() => User.deleteMany().then(database.disconnect))

})