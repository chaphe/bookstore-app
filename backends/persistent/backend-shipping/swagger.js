const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: 'backend-shipping',
            description: 'API documentation for the Shipping backend. Consumes purchase messages from RabbitMQ and stores them in memory.',
            version: '1.0.0'
        }
    },
    apis: ['./server.js'],
};

const swaggerSpec = swaggerJSDoc(options);

const swaggerJSDocs = (app) => {
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.get('/docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });
};

module.exports = { swaggerJSDocs };
