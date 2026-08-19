require('dotenv').config();
const mongoose = require("mongoose");
const reviewsModel = require("./models/ModelReviews");

mongoose.set('strictQuery', true);

const InitialReviews = [
    {
        usuario: "mannulus",
        isbn: "9789584295446",
        estrellas: 2,
        comentario: "no es muy bueno, muy aburrido, perfiero una pelicula"
    },
    {
        usuario: "chaphe",
        isbn: "9789584276971",
        estrellas: 5,
        comentario: "una excelente guia del autocuidado"
    },
    {
        usuario: "mapache",
        isbn: "9789584295446",
        estrellas: 5,
        comentario: "Aunque no murio por snuznu muy interesante un poco ficticio"
    },
    {
        usuario: "javier",
        isbn: "9789585190603",
        estrellas: 5,
        comentario: "este libro me ayudo a comprender el metabolismo de mi cuerpo y a lllevar un estilo de vida más saludable"
    },
    {
        usuario: "manuel",
        isbn: "9789585190603",
        estrellas: 3,
        comentario: "al menos pase un rato leyendo no me aporto nada pero es facil de leer"
    },
    {
        usuario: "maria",
        isbn: "9789585190603",
        estrellas: 5,
        comentario: "me calme al leer esto, muybuen libro"
    },
    {
        usuario: "dayana",
        isbn: "9789585190300",
        estrellas: 5,
        comentario: "Excelente libro lo super recomiendo muy motivador"
    },
    {
        usuario: "samuel",
        isbn: "9789585190300",
        estrellas: 2,
        comentario: "No proporciona nada de motivacion."
    },
    {
        usuario: "carlos",
        isbn: "9789585191066",
        estrellas: 4,
        comentario: "por momentos se torna aburrida."
    },
    {
        usuario: "sammy",
        isbn: "9789585190366",
        estrellas: 5,
        comentario: "uno de los mejores libros que he leido"
    },
    {
        usuario: "jhon",
        isbn: "9789585190001",
        estrellas: 5,
        comentario: "muy bonita historia para contarles a tus hijos"
    },
    {
        usuario: "gabriel",
        isbn: "9789585190001",
        estrellas: 3,
        comentario: "muy infantil."
    },
    {
        usuario: "GabrielVega",
        isbn: "10010090321",
        estrellas: 4,
        comentario: "Gran libro para aprender a programar, sin embargo me quedó la duda de ¿cuál es la entrada y cuál es la salida?"
    },
    {
        usuario: "FelipeCabeza",
        isbn: "10010090321",
        estrellas: 5,
        comentario: "Obra magnifica, aprendí a hacer el factorial"
    },
    {
        usuario: "MarkSuckerberg",
        isbn: "10010090321",
        estrellas: 5,
        comentario: "Me sirvió para hacer Facebook👍🏻😎📘"
    },
    {
        usuario: "GabrielVega",
        isbn: "123132131321",
        estrellas: 5,
        comentario: "Un clásico de la literatura"
    },
    {
        usuario: "FelipeCabeza",
        isbn: "03213128888",
        estrellas: 5,
        comentario: "Este libro me cambió la vida... sin palabras"
    },
    {
        usuario: "Mohammed",
        isbn: "0321299999",
        estrellas: 3,
        comentario: "No sé qué es docker jaja "
    },
    {
        usuario: "GabrielVega",
        isbn: "0321299999",
        estrellas: 4,
        comentario: "Me sirvió para el trabajo de software :)"
    },
    {
        usuario: "FelipeCabeza",
        isbn: "10010090321",
        estrellas: 4,
        comentario: "Estaba tan bueno que me lo compré otra vez, pero esta vez no me gustó tanto 😕"
    },
    {
        usuario: "MarkSuckerberg",
        isbn: "9789584276971",
        estrellas: 4,
        comentario: "Buen libro"
    }
];

const uri_mongodb = 'mongodb://' + process.env.MONGODB_HOST + ':27017/test';
console.log(uri_mongodb);

mongoose.connect(uri_mongodb)
    .then(() => {
        console.log("=> Connected to MongoDB");
        return reviewsModel.insertMany(InitialReviews);
    })
    .then(() => {
        console.log("=> Insertion of initial data complete");
        return mongoose.connection.close();
    })
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });