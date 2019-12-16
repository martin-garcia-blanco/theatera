const { validate, errors: { NotFoundError, ContentError } } = require('theatera-util')
const { ObjectId, models: { User, Post } } = require('theatera-data')

/**
 *
 * retrieve a post filtered by Id
 * 
 * @param {ObjectId} postId * 
 * @returns {Object}
 */
module.exports = function(postId) {
    validate.string(postId)
    validate.string.notVoid('postId', postId)
    if (!ObjectId.isValid(postId)) throw new ContentError(`${postId} is not a valid id`)

    return (async() => {
        const post = await Post.findById(postId).populate("comments.user")
        if (!post) throw new NotFoundError(`post with id ${postId} not found`)

        const user = await User.findById(post.user)
        if (!post) throw new NotFoundError(`user with id ${postId} not found`)

        const { image, name } = user
        const { body, date, likes, comments, type } = post
        let introduction
        !introduction ? introduction = '' : introduction = introduction.slice(0, 40) + '...'
        const result = { user: { id: user.id, image, introduction, name }, post: { id: post.id, body, date, likes, comments, type } }
        return result

    })()
}