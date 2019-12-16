const call = require('../../utils/call')
const { validate, errors: { ConflictError } } = require('theatera-util')
const API_URL = process.env.REACT_APP_API_URL

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
        const res = await call(`${API_URL}/users/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, isCompany })
        })

        if (res.status === 201) return 

        if (res.status === 409) throw new ConflictError(JSON.parse(res.body).message)

        throw new Error(JSON.parse(res.body).message)
    })()
}