const { Schema, ObjectId } = require('mongoose')
const { validators: { isEmail } } = require('theatera-util')
const Chat = require('./chat')
const Post = require('./post')
const User = require('./user')

const ExperienceItem = require('./experienceItem')


module.exports = new Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        validate: isEmail

    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true,
        default: "/home/martingarcia/bootcamp/colab/skylab-bootcamp-201909/staff/martin-garcia/theatera/theatera-api/data/users/defaultImage/profile.jpg"
    },
    lastAccess: {
        type: Date,
    },
    phone: {
        type: String,
    },
    address: {
        type: String,
    },
    city: {
        type: String,
    },
    website: {
        type: String,
    },
    introduction: {
        type: String,
    },
    description: {
        type: String,
    },
    skills: {
        type: [String],
    },
    experience: {
        type: [ExperienceItem],

    },
    rol: {
        type: String,
        enum: ['PERSON', 'COMPANY'],
        required: true,
        default: "PERSON"
    },
    specificInfo: {
        type: Object,
    },
    chats: {
        type: [ObjectId],
        ref: 'Chat'
    },
    connections: {
        type: [ObjectId],
        ref: 'Connection',
        default: []
    },
    notifications: {
        type: [Object],
        default: [],
        ref: "Notification"
    },
})