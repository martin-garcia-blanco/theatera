require('dotenv').config()
const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const { random } = Math
const updateUser = require('.')
const { errors: { NotFoundError, ContentError } } = require('theatera-util')
const { ObjectId, database, models: { User, Notification } } = require('theatera-data')





describe('logic - updateUser', () => {
    before(() => database.connect(TEST_DB_URL))

    let userId, user, name, introduction, description, gender, age, phone, email, website, city, languages, height, weight, rol

    beforeEach(async() => {
        name = `name-${random()}`
        email = `email-${random()}@mail.com`
        introduction = `introduction-${random()}`
        description = `description-${random()}`
        gender = random() > 0.5 ? 'MAN' : 'WOMAN'
        phone = `phone-${random()}`
        website = `website-${random()}`
        city = `city-${random()}`
        languages = [`language-${random()}`, `language-${random()}`]
        height = random()
        weight = random()
        rol = "PERSON"
        password = `password-${random()}`

        await User.deleteMany()
        const specificInfo = { languages, height, weight, gender, age }

        user = await User.create({ name, password, introduction, description, phone, email, website, city, rol, specificInfo })

        userId = user.id
    })

    it('should succeed on correct user ', async() => {
        const newName = `New-name-${random()}`
        const newIntroduction = `New-introduction-${random()}`
        const newDescription = `New-description-${random()}`
        const newCity = `new-City-${random()}`


        const newEmail = `new-email-${random()}@mail.com`
        const newPhone = `new-phone-${random()}`
        const newWebsite = `new-website-${random()}`
        const newLanguages = [`new-language-${random()}`, `new-language-${random()}`]
        const newHeight = random()
        const newWeight = random()
        const newAge = random()
        let newGender
        gender === 'WOMAN' ? newGender = 'MAN' : newGender = 'WOMAN'
        const _specificInfo = {
            languages: newLanguages,
            height: newHeight,
            weight: newWeight,
            gender: newGender,
            age: newAge
        }
        const response = await updateUser(userId, { email: newEmail, phone: newPhone, website: newWebsite, specificInfo: _specificInfo, description: newDescription, introduction: newIntroduction, name: newName, city: newCity, rol })
        expect(response).to.not.exist
        const _user = await User.findById(userId)
        expect(_user.description).to.exist
        expect(_user.description).to.be.a('string')
        expect(_user.description).to.have.length.greaterThan(0)
        expect(_user.description).to.equal(newDescription)

        expect(_user.name).to.exist
        expect(_user.name).to.be.a('string')
        expect(_user.name).to.have.length.greaterThan(0)
        expect(_user.name).to.equal(newName)

        expect(_user.city).to.exist
        expect(_user.city).to.be.a('string')
        expect(_user.city).to.have.length.greaterThan(0)
        expect(_user.city).to.equal(newCity)

        expect(_user.introduction).to.exist
        expect(_user.introduction).to.be.a('string')
        expect(_user.introduction).to.have.length.greaterThan(0)
        expect(_user.introduction).to.equal(newIntroduction)

        expect(_user.email).to.exist
        expect(_user.email).to.be.a('string')
        expect(_user.email).to.have.length.greaterThan(0)
        expect(_user.email).to.equal(newEmail)

        expect(_user.specificInfo.gender).to.exist
        expect(_user.specificInfo.gender).to.be.a('string')
        expect(_user.specificInfo.gender).to.have.length.greaterThan(0)
        expect(_user.specificInfo.gender).to.equal(newGender)

        expect(_user.phone).to.exist
        expect(_user.phone).to.be.a('string')
        expect(_user.phone).to.have.length.greaterThan(0)
        expect(_user.phone).to.equal(newPhone)

        expect(_user.website).to.exist
        expect(_user.website).to.be.a('string')
        expect(_user.website).to.have.length.greaterThan(0)
        expect(_user.website).to.equal(newWebsite)

        expect(_user.city).to.exist
        expect(_user.city).to.be.a('string')
        expect(_user.city).to.have.length.greaterThan(0)
        expect(_user.city).to.equal(newCity)

        expect(_user.specificInfo.languages).to.exist
        expect(_user.specificInfo.languages).to.be.a('array')
        expect(_user.specificInfo.languages).to.have.length.greaterThan(0)
        expect(_user.specificInfo.languages).to.deep.equal(newLanguages)
        expect(_user.specificInfo.weight).to.exist
        expect(_user.specificInfo.weight).to.be.a('number')
        expect(_user.specificInfo.weight).to.equal(newWeight)

        expect(_user.specificInfo.height).to.exist
        expect(_user.specificInfo.height).to.be.a('number')
        expect(_user.specificInfo.height).to.equal(newHeight)

        expect(_user.specificInfo.age).to.exist
        expect(_user.specificInfo.age).to.be.a('number')
        expect(_user.specificInfo.age).to.equal(newAge)
    })






    it('should fail on unexisting user and correct task data', async() => {
        const id = ObjectId().toString()
        const data = {}

        expect(() => updateUser('')).to.throw(ContentError, ' is empty or blank')
        expect(() => updateUser(' \t\r')).to.throw(ContentError, ' is empty or blank')
    })

    it('should fail on unexisting user and correct task data', async() => {
        const newName = `New-name-${random()}`
        const newIntroduction = `New-introduction-${random()}`
        const newDescription = `New-description-${random()}`
        const newCity = `new-City-${random()}`


        const newEmail = `new-email-${random()}@mail.com`
        const newPhone = `new-phone-${random()}`
        const newWebsite = `new-website-${random()}`
        const newLanguages = [`new-language-${random()}`, `new-language-${random()}`]
        const newHeight = random()
        const newWeight = random()
        const newAge = random()
        let newGender

        gender === 'WOMAN' ? newGender = 'MAN' : newGender = 'WOMAN'
        const _specificInfo = {
            languages: newLanguages,
            height: newHeight,
            weight: newWeight,
            gender: newGender,
            age: newAge
        }
        const id = ObjectId().toString()


        try {

            await updateUser(id, { email: newEmail, phone: newPhone, website: newWebsite, specificInfo: _specificInfo, description: newDescription, introduction: newIntroduction, name: newName, city: newCity, rol })
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            expect(error.message).to.equal(`user with id ${id} not found`)
        }
    })

    /*  it('should fail on correct user and unexisting task data', async() => {
         const taskId = ObjectId().toString()
         const newTitle = `new-title-${random()}`
         const newDescription = `new-description-${random()}`
         const newStatus = statuses.random()

         try {
             await updateUser(id, taskId, newTitle, newDescription, newStatus)

             throw new Error('should not reach this point')
         } catch (error) {
             expect(error).to.exist
             expect(error).to.be.an.instanceOf(NotFoundError)
             expect(error.message).to.equal(`user does not have task with id ${taskId}`)
         }
     })

     it('should fail on correct user and wrong task data', async() => {
         const { _id } = await Task.findOne({ _id: { $nin: taskIds.map(taskId => ObjectId(taskId)) } })

         const taskId = _id.toString()
         const newTitle = `new-title-${random()}`
         const newDescription = `new-description-${random()}`
         const newStatus = statuses.random()

         try {
             await updateUser(id, taskId, newTitle, newDescription, newStatus)

             throw new Error('should not reach this point')
         } catch (error) {
             expect(error).to.exist
             expect(error).to.be.an.instanceOf(ConflictError)
             expect(error.message).to.equal(`user with id ${id} does not correspond to task with id ${taskId}`)
         }
     })

     it('should fail on correct user and wrong task status', () => {
         const taskId = taskIds.random()
         const newTitle = `new-title-${random()}`
         const newDescription = `new-description-${random()}`
         const newStatus = 'wrong-status'

         expect(() => updateUser(id, taskId, newTitle, newDescription, newStatus)).to.throw(ContentError, `${newStatus} does not match any of the valid status values: ${statuses}`)
     }) */

    // TODO other test cases

    after(() => User.deleteMany().then(database.disconnect))
})