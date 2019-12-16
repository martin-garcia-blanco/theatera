const { validate, errors: { NotFoundError, ContentError } } = require('theatera-util')
const { ObjectId, models: { User, FriendRequest } } = require('theatera-data')


/**
 * retrieve the all friend requests from an user
 * 
 * @param {ObjectId} userId
 * 
 * @returns {Array}
 */
module.exports = function(userId) {
    validate.string(userId)
    validate.string.notVoid('userId', userId)
    if (!ObjectId.isValid(userId)) throw new ContentError(`${userId} is not a valid id`)

    return (async() => {
        const user = await User.findById(userId)
        if (!user) throw new NotFoundError(`user with id ${userId} not found`)

        const friendRequests = await FriendRequest.find({ "receiver": ObjectId(userId) })

        const result = await Promise.all(friendRequests.map(async con => {
            const emitterId = con.creator._id.toString()
            const emitter = await User.findById(emitterId)
            let introduction
            emitter.introduction ? introduction = emitter.introduction.slice(0, 40) + '...' : introduction = ''
            const { image, name, id } = emitter
            return { id, name, image, introduction }
        }))

        return result
    })()
}