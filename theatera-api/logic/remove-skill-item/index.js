const { validate, errors: { NotFoundError, ContentError } } = require('theatera-util')
const { ObjectId, models: { User } } = require('theatera-data')


/**
 *
 * Remove a skill item from an user
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
        const _skill = user.skills.find(ele => ele === skill)
        if (!_skill) throw new NotFoundError(`user does not have skill with name ${skill}`)

        skills = user.skills.filter(ele => ele !== skill)
        user.skills = skills

        await user.save()

        return skill
    })()


}