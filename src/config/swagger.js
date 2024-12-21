const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const swaggerDocument = yaml.load(fs.readFileSync(path.join(__dirname, "../../swagger/swagger.yaml"), "utf8"));

const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};

module.exports = setupSwagger;
