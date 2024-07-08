const mongoose = require('mongoose');

let reviewSchema = new mongoose.Schema({
    usuario: String,
    isbn: String,
    estrellas: Number,
    comentario: String
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;