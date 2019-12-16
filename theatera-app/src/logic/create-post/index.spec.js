require('dotenv').config()
const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const { random } = Math
const createPost = require('.')
const { errors: { NotFoundError, ConflictError, ContentError } } = require('theatera-util')
const { ObjectId, database, models: { User, Post } } = require('theatera-data')

describe('logic - createPost', () => {
    before(() => database.connect(TEST_DB_URL))

    let userId, postId, body, post, type

    beforeEach(async() => {
        const name = `name-${random()}`
        const email = `email-${random()}@mail.com`
        const password = `password-${random()}`
        random() > 0.5 ? rol = 'COMPANY' : rol = 'PERSON'

        await Promise.all([User.deleteMany(), Post.deleteMany()])

        let user = await User.create({ name, email, password, rol })
        userId = user.id
    })


    it('Should succed on correct post', async() => {
        body = `body-${random()}`
        type = 'ARTICLE'

        postId = await createPost(userId, body, type)
        _post = await Post.findById(postId)

        expect(_post).to.exist
        expect(_post.body).to.exist
        expect(_post.body).to.equal(body)
    })


    it('should fail on unexisting user and correct post', async() => {
        const userId = ObjectId().toString()

        try {
            await createPost(userId, body)
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            expect(error.message).to.equal(`user with id ${userId} not found`)
        }
    })



    it('should fail on incorrect userId, body and type', () => {

        expect(() => createPost(1)).to.throw(TypeError, '1 is not a string')
        expect(() => createPost(true)).to.throw(TypeError, 'true is not a string')
        expect(() => createPost([])).to.throw(TypeError, ' is not a string')
        expect(() => createPost({})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => createPost(undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => createPost(null)).to.throw(TypeError, 'null is not a string')
        expect(() => createPost('')).to.throw(ContentError, 'userId is empty or blank')
        expect(() => createPost(' \t\r')).to.throw(ContentError, 'userId is empty or blank')

        expect(() => createPost(userId, 1)).to.throw(TypeError, '1 is not a string')
        expect(() => createPost(userId, true)).to.throw(TypeError, 'true is not a string')
        expect(() => createPost(userId, [])).to.throw(TypeError, ' is not a string')
        expect(() => createPost(userId, {})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => createPost(userId, undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => createPost(userId, null)).to.throw(TypeError, 'null is not a string')
        expect(() => createPost(userId, '')).to.throw(ContentError, 'body is empty or blank')
        expect(() => createPost(userId, ' \t\r')).to.throw(ContentError, 'body is empty or blank')

        expect(() => createPost(userId, body, 1)).to.throw(TypeError, '1 is not a string')
        expect(() => createPost(userId, body, true)).to.throw(TypeError, 'true is not a string')
        expect(() => createPost(userId, body, [])).to.throw(TypeError, ' is not a string')
        expect(() => createPost(userId, body, {})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => createPost(userId, body, null)).to.throw(TypeError, 'null is not a string')
        expect(() => createPost(userId, body, '')).to.throw(ContentError, 'type is empty or blank')
        expect(() => createPost(userId, body, ' \t\r')).to.throw(ContentError, 'type is empty or blank')
    })

    after(() => Promise.all([User.deleteMany(), Post.deleteMany()]).then(database.disconnect))



})