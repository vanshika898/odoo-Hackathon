const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectionDb = require("./config/Database");
const routes = require('./routes/UserRoutes')
dotenv.config();
const cookieParser = require("cookie-parser");


const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors());
connectionDb();


app.get("/", (req, res) => {
    res.send("Backend is running...");
});
app.use('/api/v1',routes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});