require('dotenv').config()
const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const { random } = Math
const removeSkillItem = require('.')
const { errors: { NotFoundError, ContentError } } = require('theatera-util')
const { ObjectId, database, models: { User } } = require('theatera-data')

describe('logic - createskillItem', () => {
    before(() => database.connect(TEST_DB_URL))

    let userId, skill

    beforeEach(async() => {
        name = `name-${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
        random() > 0.5 ? rol = 'COMPANY' : rol = 'PERSON'

        skill = `skill-${random()}`



        await Promise.all([User.deleteMany()])
        let user = await User.create({ name, email, password, rol })
        userId = user.id

        user.skills.push(skill)
        await user.save()

    })

    it('Should succed on correct skill', async() => {


        user = await User.findById(userId)
        const skillBeforeRemove = user.skills.find(ele => ele === skill)
        expect(skillBeforeRemove).to.exist

        await removeSkillItem(userId, skill)

        user = await User.findById(userId)
        const skillAfterRemove = user.skills.find(ele => ele === skill)

        expect(skillAfterRemove).to.not.exist

    })


    it('should fail on unexisting user and correct skill', async() => {
        const userId = ObjectId().toString()

        try {
            await removeSkillItem(userId, skill)
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            expect(error.message).to.equal(`user with id ${userId} not found`)
        }
    })

    it('should fail on correct user and unexisting skill data', async() => {
        const _skill = `skill-${random()}`

        try {
            await removeSkillItem(userId, _skill)
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            expect(error.message).to.equal(`user does not have skill with name ${_skill}`)
        }
    })

    it('should fail on incorrect user objectId', async() => {
        const wrongUserId = `userId-${random()}`

        try {
            await removeSkillItem(wrongUserId, skill)
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(ContentError)
            expect(error.message).to.equal(`${wrongUserId} is not a valid id`)
        }

    })

    after(() => User.deleteMany().then(database.disconnect))

})