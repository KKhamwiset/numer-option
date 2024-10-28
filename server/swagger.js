const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger.json';
const endpointsFiles = ['./Routers/*.js'];

const config = {
    info: {
        title: 'API Documentation',
        description: 'DETAIL API DOCUMENTATION',
    },
    tags: [ ],
    host: 'localhost:5000/api',
    schemes: ['http', 'https'],
};

swaggerAutogen(outputFile, endpointsFiles, config);