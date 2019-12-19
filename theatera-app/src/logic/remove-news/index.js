const call = require('../../utils/call')
const { validate, errors: { NotFoundError } } = require('theatera-util')
const API_URL = process.env.REACT_APP_API_URL

module.exports = function(token, notificationId) {
    validate.string(token)
    validate.string.notVoid('token', token)

    validate.string(notificationId)
    validate.string.notVoid('notificationId', notificationId)

    return (async() => {
        const res = await call(`${API_URL}/users/notification/${notificationId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        })

        
        if (res.status === 202) return 

        if (res.status === 404) throw new NotFoundError(JSON.parse(res.body).message)

        throw new Error(JSON.parse(res.body).message)
    })()
}