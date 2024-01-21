const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Projet CSO API Documentation',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:5000/', 
      },
    ],
    components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/oeuvre.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
