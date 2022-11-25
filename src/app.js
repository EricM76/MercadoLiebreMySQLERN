/* REQUIRES */
require("dotenv").config();
const express = require("express");
const logger = require("morgan");
const app = express();
const cors = require('cors');

/* Middleware */
app.use(express.urlencoded({ extended: false }));
app.use(logger("dev"));
app.use(express.json());
app.use(cors());
app.use(express.static('public'))

/* Routers */
const productsRouter = require("./routes/products");
const authRouter = require("./routes/auth");
const usersRouter = require("./routes/users");
const { sendJsonError } = require("./helpers/sendJsonError");

/* Routes */
app.get('/',(req,res) => res.sendFile('/index.html'))
app.use("/products", productsRouter);
app.use("/auth", authRouter);
app.use("/users", usersRouter);

// ************ DON'T TOUCH FROM HERE ************
// ************ catch 404 and forward to error handler ************
// app.use((req, res, next) => res.status(404).json({ error: "404 Not found" }));

// ************ error handler ************
app.use((err, req, res, next) => {

  sendJsonError(err,res)

  // // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.path = req.path;
  // res.locals.error = req.app.get("env") === "development" ? err : {};

  // // render the error page
  // res.status(err.status || 500);
  // res.render("error");
});

module.exports = app;
