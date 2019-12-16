require('dotenv').config()
const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const { random } = Math
const createSkillItem = require('.')
const { errors: { NotFoundError, ConflictError } } = require('theatera-util')
const { ObjectId, database, models: { User } } = require('theatera-data')

describe('logic - createSkillItem', () => {
    before(() => database.connect(TEST_DB_URL))

    let userId, skill

    beforeEach(async() => {
        const name = `name-${random()}`
        const email = `email-${random()}@mail.com`
        const password = `password-${random()}`
        random() > 0.5 ? rol = 'COMPANY' : rol = 'PERSON'

        skill = `name-${random()}`

        await Promise.all([User.deleteMany()])

        let user = await User.create({ name, email, password, rol })
        userId = user.id

        user.skills.push(skill)

        await user.save()
    })


    it('Should succed on correct skill', async() => {
        const skillName = `skill-${random()}`
        await createSkillItem(userId, skillName)

        user = await User.findById(userId)
        const _skill = user.skills.find(ele => ele.skills === skill)
        expect(skill).to.exist
        expect(skill).to.be.a('string')
        expect(skill).to.have.length.greaterThan(0)

    })


    it('should fail on unexisting user and correct skill', async() => {
        const userId = ObjectId().toString()
        const skillName = `skill-${random}`

        try {
            await createSkillItem(userId, skillName)
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            expect(error.message).to.equal(`user with id ${userId} not found`)
        }
    })

    it('should fail on correct user and existing the same skill', async() => {


        try {
            await createSkillItem(userId, skill)

            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(ConflictError)
            expect(error.message).to.equal(`user with skill ${skill} already exists`)
        }
    })


    after(() => User.deleteMany().then(database.disconnect))

})