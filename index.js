const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./Config/connectDB");
const userRouter = require("./routes/userRoutes");
// DATABASE
const patients = require("./routes/patientsRoute");
const med = require("./routes/MedRoutes");
const tamplatesRoutes = require("./routes/tamplatesRoutes");
const PrescriptionRoutes = require("./routes/PrescriptionRoutes");
const cors = require("cors");
const app = express();
dotenv.config();
// ------middleware----
app.use(express.json());
app.use(cors());
// ------MongoDb Connection
connectDB();
// ......Routes user Routes
app.use("/user/api", userRouter);
app.use("/patients/api", patients);

app.use("/med/api", med);

//------------------------
app.use("/tamplates/api", tamplatesRoutes);
app.use("/prescription/api", PrescriptionRoutes);

app.use("/public/uploads", express.static("uploads"));

// _-----App Listen
app.listen(process.env.PORT, () => {
  console.log("app runing on port ....", process.env.PORT);
});
