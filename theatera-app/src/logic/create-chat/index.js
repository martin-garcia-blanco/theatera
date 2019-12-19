//const call = require('../../utils/call')
import call from '../../utils/call'
const { validate, errors: { ConflictError } } = require('theatera-util')
const API_URL = process.env.REACT_APP_API_URL

//module.exports = function(token, userId ) {
export default function(token, userId ) {
    validate.string(token)
    validate.string.notVoid('token', token)

    validate.string(userId)
    validate.string.notVoid('userId', userId)

    return (async() => {
        const res = await call(`${API_URL}/chat/create`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ userId })
        })

        if (res.status === 201) return JSON.parse(res.body)

        if (res.status === 409) throw new ConflictError(JSON.parse(res.body).message)

        throw new Error(JSON.parse(res.body).message)

    })()


}