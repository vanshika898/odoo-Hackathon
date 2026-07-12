const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectionDb = require("./config/Database");

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
connectionDb();

app.get("/", (req, res) => {
    res.send("Backend is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});