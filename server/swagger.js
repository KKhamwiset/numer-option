const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
    definition: { 
        openapi: '3.0.0',
        info: {
            title: 'Example API',
            version: '1.0.0',
            description: 'API documentation for example of basic APIs',
        },
        servers: [
            {
                url: 'https://numer-option-api-delta.vercel.app',  
                description: 'Production server',
            },
            {
                url: 'http://localhost:5000',  
                description: 'Local server',
            }
        ],
    },
    apis: [
        path.join(__dirname, './routes/*.js'),
        path.join(__dirname, 'server.js')
    ],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

const swaggerUiOptions = {
    customSiteTitle: "API Documentation",
};

module.exports = {
    swaggerSpec,
    swaggerUi,
    swaggerUiOptions
};