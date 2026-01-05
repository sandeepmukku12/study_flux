const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("API running successfully!");
});

app.listen(PORT, () => {
    console.log(`Server running successfully on port ${PORT}`);
});