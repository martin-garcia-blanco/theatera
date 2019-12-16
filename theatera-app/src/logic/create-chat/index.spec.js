 require('dotenv').config()
 const { env: { TEST_DB_URL } } = process
 const { expect } = require('chai')
 const { random } = Math
 const sendComment = require('.')
 const { errors: { NotFoundError, ConflictError, ContentError } } = require('theatera-util')
 const { ObjectId, database, models: { User, Post, Comment } } = require('theatera-data')

 describe('logic - sendComment', () => {
     before(() => database.connect(TEST_DB_URL))

     let userId, postId, description

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
         const post = await Post.create({ user: ObjectId(userId), body, type, date })
         postId = post.id
     })


     it('Should succed on sended comment', async() => {
         const comment = await sendComment(userId, postId, description)
         const _post = await Post.findById(postId)
         const _comment = _post.comments[0].id
         expect(comment).to.be.equal(_comment)

     })

     it('should fail on unexisting user and correct post', async() => {
         const userId = ObjectId().toString()

         try {
             await sendComment(userId, postId, description)
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
             await sendComment(userId, postId, description)
             throw new Error('should not reach this point')
         } catch (error) {
             expect(error).to.exist
             expect(error).to.be.an.instanceOf(NotFoundError)
             expect(error.message).to.equal(`post with id ${postId} not found`)
         }
     })


     it('should fail on incorrect userId and postId', () => {

         expect(() => sendComment(1)).to.throw(TypeError, '1 is not a string')
         expect(() => sendComment(true)).to.throw(TypeError, 'true is not a string')
         expect(() => sendComment([])).to.throw(TypeError, ' is not a string')
         expect(() => sendComment({})).to.throw(TypeError, '[object Object] is not a string')
         expect(() => sendComment(undefined)).to.throw(TypeError, 'undefined is not a string')
         expect(() => sendComment(null)).to.throw(TypeError, 'null is not a string')
         expect(() => sendComment('')).to.throw(ContentError, 'userId is empty or blank')
         expect(() => sendComment(' \t\r')).to.throw(ContentError, 'userId is empty or blank')

         expect(() => sendComment(userId, 1)).to.throw(TypeError, '1 is not a string')
         expect(() => sendComment(userId, true)).to.throw(TypeError, 'true is not a string')
         expect(() => sendComment(userId, [])).to.throw(TypeError, ' is not a string')
         expect(() => sendComment(userId, {})).to.throw(TypeError, '[object Object] is not a string')
         expect(() => sendComment(userId, undefined)).to.throw(TypeError, 'undefined is not a string')
         expect(() => sendComment(userId, null)).to.throw(TypeError, 'null is not a string')
         expect(() => sendComment(userId, '')).to.throw(ContentError, 'postId is empty or blank')
         expect(() => sendComment(userId, ' \t\r')).to.throw(ContentError, 'postId is empty or blank')

         expect(() => sendComment(userId, postId, 1)).to.throw(TypeError, '1 is not a string')
         expect(() => sendComment(userId, postId, true)).to.throw(TypeError, 'true is not a string')
         expect(() => sendComment(userId, postId, [])).to.throw(TypeError, ' is not a string')
         expect(() => sendComment(userId, postId, {})).to.throw(TypeError, '[object Object] is not a string')
         expect(() => sendComment(userId, postId, undefined)).to.throw(TypeError, 'undefined is not a string')
         expect(() => sendComment(userId, postId, null)).to.throw(TypeError, 'null is not a string')
         expect(() => sendComment(userId, postId, '')).to.throw(ContentError, 'description is empty or blank')
         expect(() => sendComment(userId, postId, ' \t\r')).to.throw(ContentError, 'description is empty or blank')
     })

     after(() => Promise.all([User.deleteMany(), Post.deleteMany()]).then(database.disconnect))

 })