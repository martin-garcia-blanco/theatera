require('dotenv').config()
const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const { random } = Math
const retrievePostById = require('.')
const { errors: { NotFoundError, ContentError } } = require('theatera-util')
const { database, models: { User, Post } } = require('theatera-data')

describe('logic - retrieve-post', () => {
    before(() => database.connect(TEST_DB_URL))

    let id, name, email, password, rol, img, introduction

    beforeEach(async() => {
        name = `name-${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
        random() > 0.5 ? rol = 'COMPANY' : rol = 'PERSON'
        introduction = `introduction-${random()}`

        body = `body-${random()}`
        date = new Date
        type = 'ARTICLE'
        const likes = []
        const comments = []



        await Promise.all([User.deleteMany()])
        let user = await User.create({ name, email, password, rol, introduction })
        userId = user.id
        _userId = user._id

        post = await Post.create({ body, date, type, user: _userId, })
        postId = post.id

    })


    it('should succeed on correct postId', async() => {
        const _post = await retrievePostById(postId)


        expect(_post).to.exist
        expect(_post.post.body).to.equal(body)
        expect(_post.post.body).to.be.a('string')


        expect(_post.post.date).to.be.an.instanceOf(Date)

        expect(_post.post.type).to.equal(type)
        expect(_post.post.type).to.be.a('string')

    })


    it('should fail on wrong postID', async() => {
        const id = '012345678901234567890123'

        try {
            await retrievePostById(id)

            throw Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            expect(error.message).to.equal(`post with id ${id} not found`)
        }
    })

    it('should fail on incorrect userId and postId', () => {

        expect(() => retrievePostById(1)).to.throw(TypeError, '1 is not a string')
        expect(() => retrievePostById(true)).to.throw(TypeError, 'true is not a string')
        expect(() => retrievePostById([])).to.throw(TypeError, ' is not a string')
        expect(() => retrievePostById({})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => retrievePostById(undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => retrievePostById(null)).to.throw(TypeError, 'null is not a string')
        expect(() => retrievePostById('')).to.throw(ContentError, 'postId is empty or blank')
        expect(() => retrievePostById(' \t\r')).to.throw(ContentError, 'postId is empty or blank')

    })

    after(() => Promise.all([User.deleteMany(), Post.deleteMany()]).then(database.disconnect))
})