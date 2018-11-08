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
    type: Number, //again: 0-summer, 1-fall, 2-spring, 3-winter
    required: true
  }
  /*
  meetingDays: {
    type: [Boolean],
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  location: {
    type: String,
    trim: true,
    required: true
  },
  section: {
    type: Boolean,
    required: true
  },
  sMeetingDays: [Boolean],
  sStartTime: String,
  sEndTime: String,
  sLocation: {
    type: String,
    trim: true
  }*/
});

module.exports = ClassData = mongoose.model("ClassData", classDataSchema, "userClasses");