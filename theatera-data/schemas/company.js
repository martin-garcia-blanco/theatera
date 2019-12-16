const { Schema, ObjectId } = require('mongoose')
const Post = require('./post')


module.exports = new Schema({
    jobs: {
        type: [ObjectId],
        ref: 'Post'
    }
})