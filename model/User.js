const mongoose = require('mongoose'); 
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstname: {
        type: String,
        // required: true
    },
    lastname: {
        type: String,
        // required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    roles: {
        User: {
            type: Number,
            default: 2001
        },
        Editor: {
            type: Number,
        },
        Admin: {
            type: Number,
        }
    },
    userStatus: {
        type: Number,
        // required: true
    },
    refreshToken: String
})

module.exports = mongoose.model("User", userSchema);