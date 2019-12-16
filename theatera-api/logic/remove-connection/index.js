const { ObjectId, models: { User, Chat } } = require('theatera-data')
const { validate, errors: { ContentError, NotFoundError, ConflictError } } = require('theatera-util')

/**
 *
 * Remove a user connection, in both users
 * 
 * @param {ObjectId} ownerId
 * @param {ObjectId} userId

 * 
 * @returns 
 */
module.exports = function(ownerId, userId) {
    validate.string(ownerId)
    validate.string.notVoid('ownerId', ownerId)
    if (!ObjectId.isValid(ownerId)) throw new ContentError(`${ownerId} is not a valid id`)

    validate.string(userId)
    validate.string.notVoid('userId', userId)
    if (!ObjectId.isValid(userId)) throw new ContentError(`${userId} is not a valid id`)
    
    return (async() => {
        const user = await User.findById(userId)
        if (!user) throw new NotFoundError(`user with id ${userId} not found`)

        const owner = await User.findById(ownerId)
        if (!owner) throw new NotFoundError(`user with id ${ownerId} not found`)

        if(owner.connections.includes(user.id) && user.connections.includes(owner.id)){
            owner.connections.splice(owner.connections.indexOf(user.id),1)
            user.connections.splice(user.connections.indexOf(owner.id),1)
            const chat = await Chat.findOne({
                users: {
                  $all: [ user.id, owner.id],
                  $size: 2
                }
              });
            chat && await Chat.remove({ "_id": chat.id })

            await user.save()
            await owner.save()
        }

        return
    })()
}