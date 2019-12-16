const { validate, errors: { ContentError, NotFoundError, ConflictError } } = require('theatera-util')
const { ObjectId, models: { User, Post, Comment } } = require('theatera-data')



/**
 *
 * togle like into posts
 * 
 * @param {ObjectId} userId
 * @param {ObjectId} postId
 * @returns {ObjectId}
 */
module.exports = function(userId, postId) {
    validate.string(userId)
    validate.string.notVoid('userId', userId)
    if (!ObjectId.isValid(userId)) throw new ContentError(`${userId} is not a valid id`)

    validate.string(postId)
    validate.string.notVoid('postId', postId)
    if (!ObjectId.isValid(postId)) throw new ContentError(`${postId} is not a valid id`)

    return (async() => {
        const user = await User.findById(userId)
        if (!user) throw new NotFoundError(`user with id ${userId} not found`)
        const post = await Post.findById(postId)
        if (!post) throw new NotFoundError(`post with id ${postId} not found`)

        if (post.likes.includes(ObjectId(userId))) {
            post.likes.splice(post.likes.indexOf(userId))
        } else {
            post.likes.push(ObjectId(userId))
        }

        await post.save()

        return postId
    })()
}