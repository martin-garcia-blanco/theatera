const { ObjectId, models: { User, Post } } = require('theatera-data')
const { validate, errors: { ContentError, NotFoundError, ConflictError } } = require('theatera-util')

/**
 *
 * Remove a post from an user connection
 * 
 * @param {ObjectId} userId
 * @param {ObjectId} postId

 * 
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
        if (!post) throw new NotFoundError(`user does not have post with id ${postId}`)
        
        const removedPost = await Post.remove({ "_id": ObjectId(postId) })
        if (!removedPost) throw new ConflictError('internal Error')

        return postId
    })()
}