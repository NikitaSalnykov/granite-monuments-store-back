const app = require("./app");
const mongoose = require("mongoose");

require("dotenv").config(); 

const { DB_HOST } = process.env;
console.log("DB_HOST:", DB_HOST);

mongoose
  .connect(DB_HOST, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Database connection successful"); 
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((error) => {
    console.log("Database connection error:", error.message);
    process.exit(1);
  });

  