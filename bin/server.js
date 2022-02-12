const mongoose = require("mongoose");
const app = require("../app");
require("dotenv").config();

const { DB_HOST, PORT = 8080 } = process.env;

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(PORT, () => {
      console.log("Ok, we connect to DB");
      console.log("We run in PORT 8080");
    });
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
