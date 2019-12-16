const { ObjectId, models: { User, Post } } = require('theatera-data')
const { validate, errors: { ContentError, NotFoundError, ConflictError } } = require('theatera-util')

/**
 *
 * Remove a notification from an user connection
 * 
 * @param {ObjectId} ownerId
 * @param {ObjectId} userId

 * 
 * @returns {ObjectId}
 */
module.exports = function(userId, notificationId) {
    validate.string(userId)
    validate.string.notVoid('userId', userId)
    if (!ObjectId.isValid(userId)) throw new ContentError(`${userId} is not a valid id`)

    validate.string(notificationId)
    validate.string.notVoid('notificationId', notificationId)
    if (!ObjectId.isValid(notificationId)) throw new ContentError(`${notificationId} is not a valid id`)

    return (async() => {
        const user = await User.findById(userId)
        if (!user) throw new NotFoundError(`user with id ${userId} not found`)

        const notifications = user.notifications

        notifications.forEach((noti, index)=>{
            noti._id.toString() === notificationId && user.notifications.splice(index,1)
        })
        await user.save()

        return 
    })()
}