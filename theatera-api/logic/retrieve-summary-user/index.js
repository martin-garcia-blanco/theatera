const { validate, errors: { NotFoundError, ContentError } } = require('theatera-util')
const { ObjectId, models: { User } } = require('theatera-data')


/**
 *
 * retrieve the complete profile data from an user
 * 
 * @param {ObjectId} id
 * 
 * @returns {Object}
 */
module.exports = function(id) {
    validate.string(id)
    validate.string.notVoid('id', id)

    if (!ObjectId.isValid(id)) throw new ContentError(`${id} is not a valid id`)

    return (async() => {
        const user = await User.findById(id)

        if (!user) throw new NotFoundError(`user with id ${id} not found`)

        user.lastAccess = new Date

        await user.save()

        let { name, image, introduction, hola } = user.toObject()

        !introduction ? introduction = '' : introduction = introduction.slice(0, 40) + '...'

        return { id, name, image, introduction }
    })()
}