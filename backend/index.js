import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose"

import courseRoute from "./routes/course.route.js";
import userRoute from "./routes/user.route.js";
import adminRoute from "./routes/admin.route.js";
import orderRoute from "./routes/order.route.js";

import cors from "cors";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";
import  Course  from "./models/course.model.js";

const app = express();
dotenv.config();

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.use(
  cors({
    origin: "http://localhost:5174",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const port = process.env.PORT || 3000;
const DB_URI = process.env.MONGO_URI;

try {
  await mongoose.connect("mongodb+srv://saxenasaksham111612:ss7_Dhoni@propertymanagement.gkf5tkm.mongodb.net/?retryWrites=true&w=majority&appName=propertyManagement");
  console.log("Connected to MongoDB");
} catch (error) {
  console.log(error);
}

// defining routes
app.use("/api/v1/admin/listing", courseRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/listings", courseRoute); // mount the same route for public access




app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
