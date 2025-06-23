const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const companyStockRouter = require("./routes/companyStock");

app.use("/", companyStockRouter);

//An error handling middleware
// app.use(function (err, req, res, next) {
//   res.status(500);
//   res.send("Something went wrong");
// });

module.exports = app;
