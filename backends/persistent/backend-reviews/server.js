require('dotenv').config();
const mongoose = require('mongoose');
const http = require('http');
const app = require('./app');

const port = process.env.PORT || '3000';
app.set('port', port);

mongoose.set('strictQuery', true);

const uri_mongodb = `mongodb://${process.env.MONGODB_HOST}:27017/test`;
console.log(uri_mongodb);

mongoose.connect(uri_mongodb, (err) => {
    if (err)
        console.log(err)
    else console.log("=> Connected to MongoDB")
});

const server = http.createServer(app);

server.listen(port);
console.log("Server start in port localhost:", port);