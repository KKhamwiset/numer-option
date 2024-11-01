const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

class Swagger {
    static swaggerOptions = {
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

    static swaggerSpec = swaggerJsdoc(this.swaggerOptions);

    static swaggerUiOptions = {
        customSiteTitle: "API Documentation",
        customCss: `
            .swagger-ui .opblock-summary-path { 
                white-space: nowrap; 
                overflow: hidden; 
                text-overflow: ellipsis;
            }
            .swagger-ui .opblock-summary-description {
                margin-top: 0;  /* Adjust the spacing to align the layout */
            }
        `,
    };    
    static swaggerUi = swaggerUi;
    static serve = swaggerUi.serve;
}
module.exports = Swagger;