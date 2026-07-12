// // const express = require("express");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");
// require("dotenv").config();

// const { connectDB } = require("./config/Database");

// const authRoutes = require("./routes/UserRoutes");
// const vehicleRoutes = require("./routes/vehicleRoutes");
// const driverRoutes = require("./routes/driverRoutes");
// const tripRoutes = require("./routes/tripRoutes");
// const maintenanceRoutes = require("./routes/maintenanceRoutes");
// const fuelExpenseRoutes = require("./routes/fuelExpenseRoutes");
// const dashboardRoutes = require("./routes/dashboardRoutes");

// const app = express();
// const PORT = process.env.PORT || 4000;

// connectDB();

// app.use(express.json());
// app.use(cookieParser());
// app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));

// app.use("/api/v1/auth", authRoutes);
// app.use("/api/v1/vehicles", vehicleRoutes);
// app.use("/api/v1/drivers", driverRoutes);
// app.use("/api/v1/trips", tripRoutes);
// app.use("/api/v1/maintenance", maintenanceRoutes);
// app.use("/api/v1", fuelExpenseRoutes); // exposes /fuel and /expenses
// app.use("/api/v1/dashboard", dashboardRoutes);

// app.get("/", (req, res) => {
//   res.send("TransitOps API is running");
// });

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

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