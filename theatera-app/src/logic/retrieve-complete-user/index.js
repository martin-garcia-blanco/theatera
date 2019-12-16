const call = require('../../utils/call')
const { validate, errors: { ConflictError } } = require('theatera-util')
const API_URL = process.env.REACT_APP_API_URL

module.exports = function(id, token) {
    validate.string(id)
    validate.string.notVoid('id', id)

    return (async() => {

        const res = await call(`${API_URL}/users/completeuser/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        if (res.status === 200) return JSON.parse(res.body)

        if (res.status === 409) throw new ConflictError(JSON.parse(res.body).message)

        throw new Error(JSON.parse(res.body).message)

    })()
}