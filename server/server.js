const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.PORT || 5000;
const MONGO_DB_URI = process.env.MONGO_DB_URI;

const app = express();

app.use(cors());
app.use(express.json());

//MongoDB Connection
mongoose
  .connect(MONGO_DB_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error);
  });

app.get("/", (req, res) => {
  res.send("API running successfully!");
});

app.listen(PORT, () => {
  console.log(`Server running successfully on port ${PORT}`);
});
