const { validate, errors: { ContentError, NotFoundError, ConflictError } } = require('theatera-util')
const { ObjectId, models: { User, FriendRequest, Notification } } = require('theatera-data')


/**
 *
 * Checks the status of a friend request, 3 ways:
 *      - First friendRequest -> send notification to receiver user
 *      - Retried of a friend request -> nothing to do
 *      - Reciprocal friend request -> connect both user,
 *           and send notifications to both users
 * 
 * @param {ObjectId} emiterId
 * @param {ObjectId} receiverId
 * 
 * @returns {String}
 */
module.exports = function(emiterId, receiverId) {
    validate.string(emiterId)
    validate.string.notVoid('emiterId', emiterId)
    if (!ObjectId.isValid(emiterId)) throw new ContentError(`${emiterId} is not a valid id`)

    validate.string(receiverId)
    validate.string.notVoid('receiverId', receiverId)
    if (!ObjectId.isValid(receiverId)) throw new ContentError(`${receiverId} is not a valid id`)
    return (async() => {
        const emiter = await User.findById(emiterId)
        if (!emiter) throw new NotFoundError(`user with id ${emiterId} not found`)

        const receiver = await User.findById(receiverId)
        if (!receiver) throw new NotFoundError(`user with id ${receiverId} not found`)

        if (emiter.connections.includes(receiver._id)) return "already friends"

        const repeatedFriendRequest = await FriendRequest.findOne({ "creator": ObjectId(emiterId), "receiver": ObjectId(receiverId) })
        if (repeatedFriendRequest) return "Still waiting for confirmation"

        const reciprocalFriendRequest = await FriendRequest.findOne({ "creator": ObjectId(receiverId), "receiver": ObjectId(emiterId) })
        if (reciprocalFriendRequest) {
            const drop = await FriendRequest.remove({ "creator": ObjectId(receiverId), "receiver": ObjectId(emiterId) })

            if (!drop) throw new ConflictError("internal error, removing an existing friendRequest")

            emiter.connections.push(ObjectId(receiverId))
            receiver.connections.push(ObjectId(emiterId))
            const date = new Date

            const noti1 = new Notification({ body: { message: "new friend", name: receiver.name, image: receiver.image, id: receiver.id, type: 'CONNECTION', date } })
            emiter.notifications.push(noti1)

            const noti2 = new Notification({ body: { message: "new friend", name: emiter.name, image: emiter.image, id: emiter.id, type: 'CONNECTION', date } })
            receiver.notifications.push(noti2)

            await emiter.save()
            await receiver.save()

            return "new connection"
        }

        if (!repeatedFriendRequest && !reciprocalFriendRequest) {
            await FriendRequest.create({ "creator": ObjectId(emiterId), "receiver": ObjectId(receiverId) })

            const noti = new Notification({ body: { message: "friendRequest", name: emiter.name,introduction:emiter.introduction, image: emiter.image, id: emiter.id, type: 'REQUEST', date: new Date } })
            receiver.notifications.push(noti)
            await receiver.save()

            return "new request"
        }


    })()
}