const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create data schema that'll hold schedule info
const GEDataSchema = new Schema({
  geID: {
    type: String
  },
  desc: {
    type: String
  },
  credits: {
    type: Number
  },
});

module.exports = GEData = mongoose.model("GEData", GEDataSchema);
