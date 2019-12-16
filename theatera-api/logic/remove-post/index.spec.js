require('dotenv').config()
const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const { random } = Math
const removePost = require('.')
const { errors: { NotFoundError, ContentError } } = require('theatera-util')
const { ObjectId, database, models: { User, Post } } = require('theatera-data')

describe('logic - removePost', () => {
    before(() => database.connect(TEST_DB_URL))

    let userId, user_Id, postId, body, date, type

    beforeEach(async() => {
        name = `name-${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
        random() > 0.5 ? rol = 'COMPANY' : rol = 'PERSON'

        body = `body-${random()}`
        date = new Date
        type = 'ARTICLE'
        const likes = []
        const comments = []



        await Promise.all([Post.deleteMany(), User.deleteMany()])
        let user = await User.create({ name, email, password, rol })
        userId = user.id
        user_Id = user._id

        post = await Post.create({ body, date, type, user: user_Id, })
        postId = post.id

    })

    it('Should succed on correct post', async() => {



        const postBeforeRemove = await Post.findById(postId)
        expect(postBeforeRemove).to.exist

        expect(postBeforeRemove.body).to.exist
        expect(postBeforeRemove.date).to.exist
        expect(postBeforeRemove.type).to.exist
        await removePost(userId, postId)

        const postAfterRemove = await Post.findById(postId)

        expect(postAfterRemove).to.not.exist

    })


    it('should fail on unexisting user and correct post', async() => {
        const userId = ObjectId().toString()

        try {
            await removePost(userId, postId)
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            expect(error.message).to.equal(`user with id ${userId} not found`)
        }
    })

    it('should fail on correct user and unexisting post data', async() => {
        const postId = ObjectId().toString()

        try {
            await removePost(userId, postId)

            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            expect(error.message).to.equal(`user does not have post with id ${postId}`)
        }
    })

    it('should fail on incorrect userId and postId', () => {

        expect(() => removePost(1)).to.throw(TypeError, '1 is not a string')
        expect(() => removePost(true)).to.throw(TypeError, 'true is not a string')
        expect(() => removePost([])).to.throw(TypeError, ' is not a string')
        expect(() => removePost({})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => removePost(undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => removePost(null)).to.throw(TypeError, 'null is not a string')
        expect(() => removePost('')).to.throw(ContentError, 'userId is empty or blank')
        expect(() => removePost(' \t\r')).to.throw(ContentError, 'userId is empty or blank')

        expect(() => removePost(userId, 1)).to.throw(TypeError, '1 is not a string')
        expect(() => removePost(userId, true)).to.throw(TypeError, 'true is not a string')
        expect(() => removePost(userId, [])).to.throw(TypeError, ' is not a string')
        expect(() => removePost(userId, {})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => removePost(userId, undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => removePost(userId, null)).to.throw(TypeError, 'null is not a string')
        expect(() => removePost(userId, '')).to.throw(ContentError, 'postId is empty or blank')
        expect(() => removePost(userId, ' \t\r')).to.throw(ContentError, 'postId is empty or blank')
    })


    after(() => Promise.all([User.deleteMany(), Post.deleteMany()]).then(database.disconnect))

})