import express from "express";
import {
  buyCourses,
  courseDetails,
  createCourse,
  deleteCourse,
  getCourses,
  updateCourse,
} from "../controllers/course.controller.js";
import userMiddleware from "../middlewares/user.mid.js";
import adminMiddleware from "../middlewares/admin.mid.js";

const router = express.Router();
router.get("/", getCourses); // make this the public route

router.post("/create", adminMiddleware, createCourse);
router.put("/update/:courseId", adminMiddleware, updateCourse);
router.delete("/delete/:courseId", adminMiddleware, deleteCourse);

router.get("/listings", getCourses);
router.get("/:listingId", courseDetails);

router.post("/buy/:listingId", userMiddleware, buyCourses);

export default router;
