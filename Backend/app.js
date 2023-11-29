const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
mongoose.set("strictQuery", false);
mongoose.set("runValidators", true);

const PORT = 8000;
const app = express();

app.use(express.json());
app.use(cors());

const URL = `mongodb+srv://admin:admin@cluster0.o4v9nwy.mongodb.net/smartcart?retryWrites=true&w=majority`;

mongoose.connect(URL);

const db = mongoose.connection;

db.once("Connected", () => {
  console.log("Database connected");
});

db.on("Disconected", () => {
  console.log("Database disconected");
});

db.on("Error", (error) => {
  console.log("Database error", error);
});

const list = require("./Controller/listController");
app.use("/", list);
const user = require("./Controller/userController");
app.use("/", user);
const sales = require("./Controller/salesController");
app.use("/", sales);
const product = require("./Controller/productController");
app.use("/", product);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
