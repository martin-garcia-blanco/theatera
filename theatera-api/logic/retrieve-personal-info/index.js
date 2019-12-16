const { validate, errors: { ContentError, NotFoundError } } = require('theatera-util')
const { ObjectId, models: { User } } = require('theatera-data')

/**
 *
 * retrieve the personal data from an user
 * 
 * @param {ObjectId} userId
 * 
 * @returns {Object}
 * 
 */
module.exports = function(userId) {
    validate.string(userId)
    validate.string.notVoid('userId', userId)

    if (!ObjectId.isValid(userId)) throw new ContentError(`${userId} is not a valid id`)

    return (async() => {
        const user = await User.findById(userId)
        if (!user) throw new NotFoundError(`user with id ${userId} not found`)

        user.lastAccess = new Date
        await user.save()

        if (user.rol === 'PERSON') {
            const { image, name, email,id, introduction, specificInfo, rol, description, phone, website, city, } = user.toObject()
            return { id:userId, image, name, email, introduction, description, phone, website, city,specificInfo, rol }
        }
  
        const { image, name, email, introduction, description, phone, website, city, rol, specificInfo } = user.toObject()
        return { id:userId, image, name, email, introduction, description, phone, website, city, specificInfo,rol }
          })()
}