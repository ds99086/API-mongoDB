const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const movie = new Schema({
    title: {
        type: String,
        required: true
    },
    director: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    keywords: {
        type: Array,
        required: true
    },
    movieID: {
        type: String,
        required: true
    },
    genre: {
        type: Array,
        required: true
    }


})

const model = mongoose.model('Movie', movie);

module.exports = model;