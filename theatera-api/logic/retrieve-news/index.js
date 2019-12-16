const { validate, errors: { NotFoundError } } = require('theatera-util')
const { ObjectId, models: { User, Notification } } = require('theatera-data')

/**
 *
 * retrieve all the news from an user
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
        let result = []

        result = await Promise.all(user.notifications.map(async (notification, index) => {
            return n = { body: notification.body, id: notification._id.toString() }
        }))

        await User.findOneAndUpdate({_id: user.id},
        { $set:{ "notifications.$[].checked" : true }})
        
        return result.reverse()
    })()

}
