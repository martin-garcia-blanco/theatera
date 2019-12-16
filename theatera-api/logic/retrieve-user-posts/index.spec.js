require('dotenv').config()
const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const { random } = Math
const retrieveUserPosts = require('.')
const { errors: { NotFoundError, ContentError } } = require('theatera-util')
const { database, models: { User, Post } } = require('theatera-data')

describe('logic - retrieve-user-posts', () => {
    before(() => database.connect(TEST_DB_URL))

    let userId, postId1, postId2, name, email, password, rol, postIds, body

    beforeEach(async() => {
        name = `name-${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
        random() > 0.5 ? rol = 'COMPANY' : rol = 'PERSON'

        body = `body-${random()}`
        date = new Date
        type = 'ARTICLE'


        await Promise.all([User.deleteMany(), Post.deleteMany()])
        let user = await User.create({ name, email, password, rol })
        userId = user.id
        _userId = user._id

        post1 = await Post.create({ body, date, type, user: _userId, })
        postId1 = post1.id
        post2 = await Post.create({ body, date, type, user: _userId, })
        postId2 = post2.id

        postIds = [postId1, postId2]
    })


    it('should succeed on correct posts', async() => {
        console.log(postId1)
        const posts = await retrieveUserPosts(userId)
        posts.forEach(element => {
            expect(element).to.exist
            expect(element.post.id).to.be.oneOf(postIds)
            expect(element.user.id).to.equal(userId)

            expect(element.post.body).to.be.equal(body)
        })
    })

    it('should fail on wrong user userId', async() => {
        const id = '012345678901234567890123'

        try {
            await retrieveUserPosts(id)

            throw Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            expect(error.message).to.equal(`user with id ${id} not found`)
        }
    })


    it('should fail on wrong user userId', async() => {
        const id = 'afasdfasdf'

        try {
            await retrieveUserPosts(id)

            throw Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(ContentError)
            expect(error.message).to.equal(`${id} is not a valid id`)
        }
    })


    it('should fail on incorrect name, surname, email, password, or expression type and content', () => {

        expect(() => retrieveUserPosts(1)).to.throw(TypeError, '1 is not a string')
        expect(() => retrieveUserPosts(true)).to.throw(TypeError, 'true is not a string')
        expect(() => retrieveUserPosts([])).to.throw(TypeError, ' is not a string')
        expect(() => retrieveUserPosts({})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => retrieveUserPosts(undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => retrieveUserPosts(null)).to.throw(TypeError, 'null is not a string')
        expect(() => retrieveUserPosts('')).to.throw(ContentError, 'userId is empty or blank')
        expect(() => retrieveUserPosts(' \t\r')).to.throw(ContentError, 'userId is empty or blank')

    })


    after(() => User.deleteMany().then(database.disconnect))
})