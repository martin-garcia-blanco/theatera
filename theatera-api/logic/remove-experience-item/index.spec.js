require('dotenv').config()
const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const { random } = Math
const removeExperienceItem = require('.')
const { errors: { NotFoundError } } = require('theatera-util')
const { ObjectId, database, models: { User, ExperienceItem } } = require('theatera-data')

describe('logic - removeExperienceItem', () => {
    before(() => database.connect(TEST_DB_URL))

    let userId, experienceId, title, dateStart, dateEnd, body, type

    beforeEach(async() => {
        name = `name-${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
        random() > 0.5 ? rol = 'COMPANY' : rol = 'PERSON'

        title = `title-${random()}`
        body = `body-${random()}`
        dateEnd = new Date()
        dateStart = new Date()
        random() > 0.5 ? type = 'JOB' : type = 'EDUCATION'



        await Promise.all([User.deleteMany(), ExperienceItem.deleteMany()])
        let user = await User.create({ name, email, password, rol })
        userId = user.id
        experience = await new ExperienceItem({ title, body, dateEnd, dateStart, type })
        experienceId = experience.id

        experience2 = await new ExperienceItem({ title, body, dateEnd, dateStart, type })
        experience3 = await new ExperienceItem({ title, body, dateEnd, dateStart, type })
        experience4 = await new ExperienceItem({ title, body, dateEnd, dateStart, type })
        user.experience.push(experience2)
        user.experience.push(experience3)
        user.experience.push(experience4)

        user.experience.push(experience)

        await user.save()

    })

    it('Should succed on correct experience', async() => {


        user = await User.findById(userId)
        const experienceBeforeRemove = user.experience.find(ele => ele.id === experienceId)
        expect(experienceBeforeRemove).to.exist

        expect(experienceBeforeRemove.title).to.exist
        expect(experienceBeforeRemove.body).to.exist
        expect(experienceBeforeRemove.type).to.exist

        const value = await removeExperienceItem(userId, experienceId)

        user = await User.findById(userId)
        const experienceAfterRemove = user.experience.find(ele => ele.id === experienceId)

        expect(experienceAfterRemove).to.not.exist

    })


    it('should fail on unexisting user and correct experience', async() => {
        const userId = ObjectId().toString()

        try {
            await removeExperienceItem(userId, experienceId)
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            expect(error.message).to.equal(`user with id ${userId} not found`)
        }
    })

    it('should fail on correct user and unexisting experience data', async() => {
        const experienceId = ObjectId().toString()

        try {
            await removeExperienceItem(userId, experienceId)

            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            expect(error.message).to.equal(`user does not have experience with id ${experienceId}`)
        }
    })


    after(() => User.deleteMany().then(database.disconnect))

})