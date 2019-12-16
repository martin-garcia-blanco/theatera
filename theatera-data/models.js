const { model } = require('mongoose')
const { message, chat, person, user, company, post, comment, notification, experienceItem, friendRequest } = require('./schemas')

module.exports = {
    User: model('User', user),
    Person: model('Person', person),
    Company: model('Company', company),
    ExperienceItem: model('ExperienceItem', experienceItem),
    Post: model('Post', post),
    Comment: model('Comment', comment),
    Message: model('Message', message),
    Chat: model('Chat', chat),
    FriendRequest: model('FriendRequest', friendRequest),
    Notification: model('Notification', notification)
}