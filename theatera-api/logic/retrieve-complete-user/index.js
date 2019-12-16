const { validate, errors: { NotFoundError, ContentError } } = require('theatera-util')
const { ObjectId, models: { User } } = require('theatera-data')


/**
 *
 * retrieve the complete profile data from an user
 * 
 * @param {ObjectId} userId
 * @param {ObjectId} id
 * 
 * @returns {Object}
 */
module.exports = function(ownerId, id) {
    validate.string(ownerId)
    validate.string.notVoid('ownerId', ownerId)
    if (!ObjectId.isValid(ownerId)) throw new ContentError(`${ownerId} is not a valid id`)

    validate.string(id)
    validate.string.notVoid('id', id)
    if (!ObjectId.isValid(id)) throw new ContentError(`${id} is not a valid id`)

    return (async() => {
        const user = await User.findById(id)
        if (!user) throw new NotFoundError(`user with id ${id} not found`)

        const owner = await User.findById(ownerId)
        if (!owner) throw new NotFoundError(`user with id ${ownerId} not found`)
        
        let connected= false

         if (owner.connections.length>0){
            owner.connections.forEach(connection => {
                if(connection.toString() === id) connected = true
            })
        }

        user.lastAccess = new Date
        await user.save()

        if (user.rol === 'PERSON') {

            const { name, image, specificInfo, city, description, skills, experience, rol} = user.toObject()
            let { introduction } = user.toObject();
            !introduction ? introduction = '' : introduction = introduction.slice(0, 20) + '...'
            return { id, name, image, specificInfo, city, description, skills, experience, introduction, rol, connected}
        }

        const { name, image, city, description, skills, experience, rol } = user.toObject()
        let introduction = user.toObject();
        !user.toObject().introduction ? introduction = '' : introduction = user.toObject().introduction.slice(0, 20) + '...'
        return { id, name, image, city, description, skills, experience, introduction, rol, connected }

    })()
}