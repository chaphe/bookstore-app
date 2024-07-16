const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Informacion sobre la api
const options = {
    definition: {
        openapi: "3.0.0",
        info: { 
            title: 'backend-reviews',
            description: 'API documentation for the Reviews backend.',
            version: '0.0.0'
        }
    },
    apis: ['./routes/reviews.js'],
};

// Documentacion en formato JSON
const swaggerSpec = swaggerJSDoc(options);

const swaggerJSDocs = (app) => {
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.get('/docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec)
    })
}

module.exports = {swaggerJSDocs};