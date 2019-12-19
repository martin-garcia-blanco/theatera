const call = require('../../utils/call')
const { validate, errors: { ConflictError } } = require('theatera-util')
const API_URL = process.env.REACT_APP_API_URL

module.exports = function(token,id) {
    validate.string(id)
    validate.string.notVoid('id', id)

    validate.string(token)
    validate.string.notVoid('token', token)

    return (async() => {
        const res = await call(`${API_URL}/users/personalinfo/${id}`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
        })
        if (res.status === 200) return JSON.parse(res.body)
        if (res.status === 409) throw new ConflictError(JSON.parse(res.body).message)

        throw new Error(JSON.parse(res.body).message)
    })()
}