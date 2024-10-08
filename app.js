const express = require("express");
const logger = require("morgan");
const cors = require("cors");
require("dotenv").config();

const authRouter = require("./routes/api/auth");
const productsRouter = require("./routes/api/products");
const reviewsRouter = require("./routes/api/reviews");
const galleryRouter = require("./routes/api/gallery");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use('/uploads', express.static('uploads'));

app.use("/api/auth", authRouter);
app.use("/api/products", productsRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/gallery", galleryRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json(message);
});

module.exports = app;