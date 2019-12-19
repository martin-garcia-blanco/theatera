import call from '../../utils/call'
const { validate, errors: { ConflictError } } = require('theatera-util')
const API_URL = process.env.REACT_APP_API_URL

export default function(token, userId) {
    validate.string(userId)
    validate.string.notVoid('userId', userId)

    validate.string(token)
    validate.string.notVoid('token', token)
    return (async() => {
        const res = await call(`${API_URL}/post/retrieveuserposts/${userId}`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
        })

        if (res.status === 200) return JSON.parse(res.body)

        if (res.status === 409) throw new ConflictError(JSON.parse(res.body).message)

        throw new Error(JSON.parse(res.body).message)
    })()
}