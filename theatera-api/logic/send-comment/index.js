const { validate, errors: { ContentError, NotFoundError, ConflictError } } = require('theatera-util')
const { ObjectId, models: { User, Post, Comment } } = require('theatera-data')

/**
 *
 * send a comment to a post
 * 
 * @param {ObjectId} userId
 * @param {ObjectId} postId
 * @param {description} description of the post
 * @returns {ObjecId}
 */
module.exports = function(userId, postId, description) {
    validate.string(userId)
    validate.string.notVoid('userId', userId)
    if (!ObjectId.isValid(userId)) throw new ContentError(`${userId} is not a valid id`)

    validate.string(postId)
    validate.string.notVoid('postId', postId)
    if (!ObjectId.isValid(postId)) throw new ContentError(`${postId} is not a valid id`)

    validate.string(description)
    validate.string.notVoid('description', description)

    return (async() => {
        const user = await User.findById(userId)
        if (!user) throw new NotFoundError(`user with id ${userId} not found`)

        const post = await Post.findById(postId)
        if (!post) throw new NotFoundError(`post with id ${postId} not found`)

        comment = new Comment({ user: userId, description, date: new Date })
        post.comments.push(comment)
        let commentId = comment.id

        await post.save()
        return commentId
    })()


}