import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Skill Assessment API",
      version: "1.0.0",
      description: "API documentation for Skill Assessment Portal",
    },
    servers: [
      {
        url: "http://localhost:5000", // update if different
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"], // your route and controller docs
};

export const swaggerSpec = swaggerJsdoc(options);
