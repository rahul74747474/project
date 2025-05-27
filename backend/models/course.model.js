import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  price: Number,
  image: {
    url: {
      type: String,
      required: true,
    },
    // other image props if any
  },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // other fields ...
});

const Course = mongoose.model("Course", courseSchema);

export default Course;
