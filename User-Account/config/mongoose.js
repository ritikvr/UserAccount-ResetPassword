const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1/signUp-Db");

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Error Connecting to db"));

db.once("open", function () {
  console.log("Successfully connected to database");
});
