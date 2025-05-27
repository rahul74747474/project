import  Course  from "../models/course.model.js";
import { Purchase } from "../models/purchase.model.js";

export const createCourse = async (req, res) => {
  const adminId = req.adminId;
  const { title, description, price, imageUrl } = req.body;

  try {
    if (!title || !description || !price || !imageUrl) {
      return res.status(400).json({ errors: "All fields are required" });
    }

    const courseData = {
      title,
      description,
      price,
       image: {
    url: imageUrl,  // send only url
  },
      creatorId: adminId,
    };

    const course = await Course.create(courseData);
    res.json({
      message: "Listing created successfully",
      course,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error creating listing" });
  }
};


export const updateCourse = async (req, res) => {
  const adminId = req.adminId;
  const { courseId } = req.params;
  const { title, description, price, imageUrl } = req.body;

  try {
    const courseSearch = await Course.findById(courseId);
    if (!courseSearch) {
      return res.status(404).json({ errors: "List not found" });
    }

    const course = await Course.findOneAndUpdate(
      {
        _id: courseId,
        creatorId: adminId,
      },
      {
        title,
        description,
        price,
        image: {
          url: imageUrl,
        },
      },
      { new: true }
    );

    if (!course) {
      return res
        .status(404)
        .json({ errors: "Can't update, created by other admin" });
    }

    res.status(201).json({ message: "List updated successfully", course });
  } catch (error) {
    res.status(500).json({ errors: "Error in list updating" });
    console.log("Error in list updating", error);
  }
};


export const deleteCourse = async (req, res) => {
  const adminId = req.adminId;
  const { courseId } = req.params;
  try {
    const course = await Course.findOneAndDelete({
      _id: courseId,
      creatorId: adminId,
    });
    if (!course) {
      return res
        .status(404)
        .json({ errors: "can't delete, created by other admin" });
    }
    res.status(200).json({ message: "List deleted successfully" });
  } catch (error) {
    res.status(500).json({ errors: "Error in list deleting" });
    console.log("Error in list deleting", error);
  }
};

export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({});
    res.status(201).json({ courses });
  } catch (error) {
    res.status(500).json({ errors: "Error in getting list" });
    console.log("error to get list", error);
  }
};

export const courseDetails = async (req, res) => {
  const { courseId } = req.params;
  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "List not found" });
    }
    res.status(200).json({ course });
  } catch (error) {
    res.status(500).json({ errors: "Error in getting list details" });
    console.log("Error in list details", error);
  }
};

import Stripe from "stripe";
import config from "../config.js";
const stripe = new Stripe(config.STRIPE_SECRET_KEY);
console.log(config.STRIPE_SECRET_KEY);
export const buyCourses = async (req, res) => {
  const { userId } = req;
  const { courseId } = req.params;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ errors: "Course not found" });
    }
    const existingPurchase = await Purchase.findOne({ userId, courseId });
    if (existingPurchase) {
      return res
        .status(400)
        .json({ errors: "User has already purchased this course" });
    }

    // stripe payment code goes here!!
    const amount = course.price;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      payment_method_types: ["card"],
    });

    res.status(201).json({
      message: "Course purchased successfully",
      course,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ errors: "Error in course buying" });
    console.log("error in course buying ", error);
  }
};
