require('dotenv').config()
const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const { random } = Math
const retrieveLatestPosts = require('.')
const { errors: { NotFoundError, ContentError } } = require('theatera-util')
const { database, models: { User, Post } } = require('theatera-data')

describe('logic - retrieve-user-posts', () => {
    before(() => database.connect(TEST_DB_URL))

    let userId, friendId, postId1, postId2, postId3, postId4, post1, post2, post3, post4, name, email, password, rol, postIds, body

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

        let friend = await User.create({ name, email, password, rol })
        friendId = friend.id
        _friendId = friend._id

        user.connections.push(_friendId.toString())
        await user.save()

        post1 = await Post.create({ body, date: new Date(1504095567283), type, user: _friendId, })
        postId1 = post1.id


        post2 = await Post.create({ body, date: new Date(1504095587283), type, user: _friendId, })
        postId2 = post2.id


        post3 = await Post.create({ body, date: new Date(1504096587283), type, user: _friendId, })
        postId3 = post3.id

        postIds = [postId1, postId2, postId3]
    })


    it('should succeed on correct posts', async() => {
        const posts = await retrieveLatestPosts(userId)
        expect(posts[0].post._id.toString()).to.be.equal(postId3)
        expect(posts[1].post._id.toString()).to.be.equal(postId2)
        expect(posts[2].post._id.toString()).to.be.equal(postId1)

    })

    it('should fail on wrong user userId', async() => {
        const id = '012345678901234567890123'

        try {
            await retrieveLatestPosts(id)

            throw Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            expect(error.message).to.equal(`user with id ${id} not found`)
        }
    })

    it('should fail on wrong empty array ', async() => {

        const a = await retrieveLatestPosts(friendId)
        expect(a.length).to.be.equal(0)
    })



    it('should fail on wrong user userId', async() => {
        const id = 'afasdfasdf'

        try {
            await retrieveLatestPosts(id)

            throw Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(ContentError)
            expect(error.message).to.equal(`${id} is not a valid id`)
        }
    })


    it('should fail on incorrect name, surname, email, password, or expression type and content', () => {

        expect(() => retrieveLatestPosts([1])).to.throw(TypeError, '1 is not a string')
        expect(() => retrieveLatestPosts([true])).to.throw(TypeError, 'true is not a string')
        expect(() => retrieveLatestPosts([
            []
        ])).to.throw(TypeError, ' is not a string')
        expect(() => retrieveLatestPosts({})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => retrieveLatestPosts(undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => retrieveLatestPosts(null)).to.throw(TypeError, 'null is not a string')
        expect(() => retrieveLatestPosts('')).to.throw(ContentError, 'id is empty or blank')
        expect(() => retrieveLatestPosts(' \t\r')).to.throw(ContentError, 'id is empty or blank')

    })


    after(() => User.deleteMany().then(database.disconnect))
})