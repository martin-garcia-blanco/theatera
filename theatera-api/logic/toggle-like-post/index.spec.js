require('dotenv').config()
const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const { random } = Math
const toggleLikePost = require('.')
const { errors: { NotFoundError, ConflictError, ContentError } } = require('theatera-util')
const { ObjectId, database, models: { User, Post, Comment } } = require('theatera-data')

describe('logic - toggleLikePost', () => {
    before(() => database.connect(TEST_DB_URL))

    let userId, post1Id, post2Id, description

    beforeEach(async() => {


        const name = `name-${random()}`
        const email = `email-${random()}@mail.com`
        const password = `password-${random()}`
        random() > 0.5 ? rol = 'COMPANY' : rol = 'PERSON'

        await Promise.all([User.deleteMany(), Post.deleteMany()])

        let user = await User.create({ name, email, password, rol })
        userId = user.id

        description = `description-${random()}`
        const date = new Date
        const type = 'ARTICLE'
        const body = `body-${random()}`

        const post1 = await Post.create({ user: ObjectId(userId), body, type, date })
        post1Id = post1.id


        const post2 = await Post.create({ user: ObjectId(userId), body, type, date, likes: [user._id] })
        post2Id = post2.id

    })


    it('Should succed on add like to post', async() => {
        await toggleLikePost(userId, post1Id)


        const post = await Post.findById(post1Id)
        const likeId = post.likes[0]._id.toString()
        expect(likeId).to.be.equal(userId)

    })


    it('Should succed on remove like to post', async() => {
        let post = await Post.findById(post2Id)
        const likeId = post.likes[0]._id.toString()
        expect(likeId).to.be.equal(userId)

        await toggleLikePost(userId, post2Id)


        post = await Post.findById(post2Id)
        expect(post.likes.length).to.equal(0)

    })

    it('should fail on unexisting user and correct post', async() => {
        const userId = ObjectId().toString()

        try {
            await toggleLikePost(userId, postId)
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            expect(error.message).to.equal(`user with id ${userId} not found`)
        }
    })

    it('should fail on unexisting user and correct post', async() => {
        const postId = ObjectId().toString()

        try {
            await toggleLikePost(userId, postId)
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            expect(error.message).to.equal(`post with id ${postId} not found`)
        }
    })


    it('should fail on incorrect userId and postId', () => {
        const fakeId = "asfasdf"

        expect(() => toggleLikePost(1)).to.throw(TypeError, '1 is not a string')
        expect(() => toggleLikePost(true)).to.throw(TypeError, 'true is not a string')
        expect(() => toggleLikePost([])).to.throw(TypeError, ' is not a string')
        expect(() => toggleLikePost({})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => toggleLikePost(undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => toggleLikePost(null)).to.throw(TypeError, 'null is not a string')
        expect(() => toggleLikePost('')).to.throw(ContentError, 'userId is empty or blank')
        expect(() => toggleLikePost(' \t\r')).to.throw(ContentError, 'userId is empty or blank')
        expect(() => toggleLikePost(fakeId)).to.throw(ContentError, `${fakeId} is not a valid id`)

        expect(() => toggleLikePost(userId, 1)).to.throw(TypeError, '1 is not a string')
        expect(() => toggleLikePost(userId, true)).to.throw(TypeError, 'true is not a string')
        expect(() => toggleLikePost(userId, [])).to.throw(TypeError, ' is not a string')
        expect(() => toggleLikePost(userId, {})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => toggleLikePost(userId, undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => toggleLikePost(userId, null)).to.throw(TypeError, 'null is not a string')
        expect(() => toggleLikePost(userId, '')).to.throw(ContentError, 'postId is empty or blank')
        expect(() => toggleLikePost(userId, ' \t\r')).to.throw(ContentError, 'postId is empty or blank')
        expect(() => toggleLikePost(userId, fakeId)).to.throw(ContentError, `${fakeId} is not a valid id`)

    })

    after(() => Promise.all([User.deleteMany(), Post.deleteMany()]).then(database.disconnect))

})