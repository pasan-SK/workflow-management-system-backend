const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const mulitipleFileSchema = new Schema({
    subtask_id: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    files: [Object]
}, {timestamps: true});

module.exports = mongoose.model('MultipleFile', mulitipleFileSchema);