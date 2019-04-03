const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const AnswerSchema = new Schema({
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String
    },
    url:{
        type: String
    }
});

module.exports = Answer = mongoose.model('answer', AnswerSchema);