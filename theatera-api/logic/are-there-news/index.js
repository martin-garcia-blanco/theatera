const { ObjectId, models: { User } } = require('theatera-data')
const { validate, errors: { ContentError, NotFoundError } } = require('theatera-util')

/**
 *Check if the user with id userId
    has some notification to read
 *
 * @param {ObjectId} userId
 * @returns {Object}
 */
module.exports = function(userId) {
    validate.string(userId)
    validate.string.notVoid('userId', userId)
    if (!ObjectId.isValid(userId)) throw new ContentError(`${userId} is not a valid id`)

    return (async() => {

        const user = await User.findById(userId)
        if (!user) throw new NotFoundError(`user with id ${userId} not found`)

        let news ={
            notifications: false
        }  
        user.notifications.forEach(notification=>{
            if(notification.checked===false){
                news.notifications=true
            }
        })
        await user.save()
        return news
    })()
}