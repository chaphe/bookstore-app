require('dotenv').config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var cors = require("cors");
var moongose = require("mongoose");

var app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


let uri_mongodb = `mongodb://${process.env.MONGODB_HOST}:27017/test`;

console.log(uri_mongodb);

//configuracion conexion
moongose.connect(uri_mongodb, null, (err) => {
    if (err)
        console.log(err)
    else console.log("=> Connect with mongondb")
});

var reseñaRouter = require('./routes/reviews');
app.use('/', reseñaRouter);

module.exports = app;
