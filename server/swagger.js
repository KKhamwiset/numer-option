const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/*.js'];

const config = {
    info: {
        title: 'API Documentation',
        description: 'APIs',
    },
    tags: [ ],
    host: 'https://numer-option-api-delta.vercel.app//api',
    schemes: ['http', 'https'],
};

swaggerAutogen(outputFile, endpointsFiles, config);