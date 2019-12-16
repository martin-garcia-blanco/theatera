const { validate, errors: { NotFoundError, ContentError, ConflictError } } = require('theatera-util')
const { ObjectId, models: { User } } = require('theatera-data')


/**
 *
 * Create a new skill
 * 
 * @param {ObjectId} userId
 * @param {String} skill
 * 
 * @returns {String} 
 */
module.exports = function(userId, skill) {
    validate.string(userId)
    validate.string.notVoid('userId', userId)
    if (!ObjectId.isValid(userId)) throw new ContentError(`${userId} is not a valid id`)

    validate.string(skill)
    validate.string.notVoid('skill', skill)

    return (async() => {
        const user = await User.findById(userId)
        if (!user) throw new NotFoundError(`user with id ${userId} not found`)
        if (user.skills.includes(skill)) throw new ConflictError(`user with skill ${skill} already exists`)

        user.skills.push(skill)
        await user.save()

        return skill
    })()
}