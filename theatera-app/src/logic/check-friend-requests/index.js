//const call = require('../../utils/call')
import call from '../../utils/call'
const { validate, errors: { ConflictError } } = require('theatera-util')
const API_URL = process.env.REACT_APP_API_URL

//module.exports = function(token, receiverId) {
export default function(token, receiverId) {
    validate.string(token)
    validate.string.notVoid('token', token)

    validate.string(receiverId)
    validate.string.notVoid('receiverId', receiverId)

    return (async() => {

        const res = await call(`${API_URL}/users/checkfriendrequests/${receiverId}`, {
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