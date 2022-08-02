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
        // User: {
        //     type: Number,
        //     default: 2001
        // },
        Admin: {
            type: Number,
            // default: 2000
        },
        DI: {
            type: Number,
        },
        CE: {
            type: Number,
        },
        DIE: {
            type: Number,
        },
        ME: {
            type: Number,
        },
        IE: {
            type: Number,
        },
        EA: {
            type: Number,
        },
        DmanDIE: {
            type: Number,
        },
        DmanDI: {
            type: Number,
        }
    },
    userStatus: {
        type: Number,
        default: 1  //1-active user, 0-deleted user
    },
    refreshToken: String
})

module.exports = mongoose.model("User", userSchema);