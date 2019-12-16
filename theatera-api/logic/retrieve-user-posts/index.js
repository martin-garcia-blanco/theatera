const { validate, errors: { NotFoundError, ContentError } } = require('theatera-util')
const { ObjectId, models: { User, Post } } = require('theatera-data')

/**
 *
 * retrieve the user's post
 * 
 * @param {ObjectId} id
 * 
 * @returns {Object}
 */
module.exports = function(userId) {
    validate.string(userId)
    validate.string.notVoid('userId', userId)
    if (!ObjectId.isValid(userId)) throw new ContentError(`${userId} is not a valid id`)

    return (async() => {
        const user = await User.findById(userId)
        if (!user) throw new NotFoundError(`user with id ${userId} not found`)

        let posts = await Post.find({ "user": ObjectId(userId) })
        posts.sort(function(a, b) {
            a = new Date(a.date);
            b = new Date(b.date);
            return a > b ? -1 : a < b ? 1 : 0;
        })

        let result = []

        result = await Promise.all(posts.map(async post => {
            const { image, name } = user
            const { body, date, likes, comments, type } = post
            return { user: { image, id: user.id, name }, post: { id: post.id, body, date, likes, comments, type } }
        }))

        return result
    })()
}