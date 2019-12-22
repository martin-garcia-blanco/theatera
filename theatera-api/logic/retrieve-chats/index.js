const { ObjectId, models: { Chat, User, Message } } = require('theatera-data')
const { validate, errors: { ContentError, NotFoundError } } = require('theatera-util')

/**
 *
 * retrieve an array of chats from an user
 * 
 * @param {ObjectId} userId

 * 
 * @returns {String}
 */
module.exports = function(userId) {
    validate.string(userId)
    validate.string.notVoid('userId', userId)
    if (!ObjectId.isValid(userId)) throw new ContentError(`${userId} is not a valid id`)

    return (async() => {
        const user = await User.findById(userId)
        if (!user) throw new NotFoundError(`user with id ${userId} not found`)

        const chats = await Chat.find({ "users": { $in: [userId] }}).populate({path:'users', model: 'User'})
        
        const _chats = []
        chats.forEach((chat)=>{
            chat.users.forEach((user,index)=>{
                user.id===userId && chat.users.splice(index,1)  
            })
            _chats.push(chat)
        })

        if (!chats) throw new NotFoundError(`chat with id ${chatId} not found`)
        return _chats
    })()
}