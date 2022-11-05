const mongoose = require('mongoose'); 
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstname: {
        type: String,
        // required: true
        // sparse: true
    },
    lastname: {
        type: String,
        // required: true
    },
    email: {
        type: String,
        required: true,
        // unique: true
        // sparse: true
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
    confirmation: {
        type: Number,
        default: 0
    },
    userStatus: {
        type: Number,
        default: 0  //1-active user, 0-not given access user,  -1-deleted user
    },
    refreshToken: String
})

module.exports = mongoose.model("User", userSchema);