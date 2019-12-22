const { validate, errors: { CredentialsError } } = require('theatera-util')
const { models: { User } } = require('theatera-data')
const bcrypt = require('bcryptjs')

/**
 *
 * Authentication function
 * 
 * @param {String} email
 * @param {String} password
 * 
 * @returns {String}
 */
module.exports = function(email, password) {

    validate.string(email)
    validate.string.notVoid('email', email)
    validate.string(password)
    validate.string.notVoid('password', password)
    validate.email(email)

    return (async() => {
        const user = await User.findOne({ email })
        if (!user) throw new CredentialsError('wrong credentials')
        const valid = await bcrypt.compare(password, user.password)
        if (!user || !valid) throw new CredentialsError('wrong credentials')

        return user.id
    })()
}