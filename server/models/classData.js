const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create data schema that'll hold schedule info
const classDataSchema = new Schema({
  userToken: {
    type: String,
    trim: true,
    required: true
  },
  courseID: {
    type: String,
    trim: true,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  quarter: {
    type: Number, //again: 0-fall, 1-summer, 2-spring, 3-winter
    required: true
  },
  lecture: {
    type: mongoose.Schema.Types.Mixed
  },
  ge: {
    type: String,
    trim: true
  },
  units: {
    type: Number
  },
  grade: {
    type: Number,
    required: true,
    default: 14
  },
  courseTitle: {
    type: String,
    trim: true
  }
});

module.exports = ClassData = mongoose.model("ClassData", classDataSchema, "userClasses");
