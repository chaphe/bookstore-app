const mongoose = require('mongoose');

var reviewModel = mongoose.model("reviewsModel",
    {
        usuario: String,
        isbn: String,
        estrellas: Number,
        comentario: String
    }, "reviews");

module.exports = reviewModel;