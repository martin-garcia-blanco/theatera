const { validate, errors: { ContentError, NotFoundError } } = require('theatera-util')
const { ObjectId, models: { User, Post } } = require('theatera-data')

/**
 *
 * Create a new post
 * 
 * @param {ObjectId} userId
 * @param {String} body
 * @param {String} type
 * 
 * @returns {ObjectId} 
 */
module.exports = function(userId, body, type = 'ARTICLE') {
    validate.string(userId)
    validate.string.notVoid('userId', userId)
    if (!ObjectId.isValid(userId)) throw new ContentError(`${userId} is not a valid id`)

    validate.string(body)
    validate.string.notVoid('body', body)

    validate.string(type)
    validate.string.notVoid('type', type)

    return (async() => {
        const user = await User.findById(userId)
        if (!user) throw new NotFoundError(`user with id ${userId} not found`)

        const date = new Date
        const likes = []
        const comments = []

        const post = await Post.create({ date, type, user: ObjectId(userId), likes, comments, body })
        return post.id
    })()
}