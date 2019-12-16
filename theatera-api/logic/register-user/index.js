const { validate, errors: { ConflictError } } = require('theatera-util')
const { models: { User } } = require('theatera-data')
const bcrypt = require('bcryptjs')
require('dotenv').config()
const { env: { SALT } } = process

/**
 *
 * User registration
 * 
 * @param {String} name
 * @param {String} email
 * @param {String} password
 * @param {Boolean} isCompany
 */
module.exports = function(name, email, password, isCompany = false) {
    validate.string(name)
    validate.string.notVoid('name', name)
    validate.string(email)
    validate.email(email)
    validate.string.notVoid('e-mail', email)
    validate.email(email)
    validate.string(password)
    validate.string.notVoid('password', password)
    validate.boolean(isCompany)

    return (async() => {
        const user = await User.findOne({ email })

        if (user) throw new ConflictError(`user with email ${email} already exists`)

        password = await bcrypt.hash(password, parseInt(SALT));

        let rol

        isCompany ? rol = 'COMPANY' : rol = 'PERSON'
        const image = "http://localhost:9000/data/users/defaultimage/profile.png"
        const specificInfo = {
            create:true
        }
        await User.create({ name, email, password, rol, image, specificInfo})
    })()
}