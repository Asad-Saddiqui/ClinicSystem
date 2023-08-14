const mongoose = require("mongoose");
const { Schema } = mongoose;
const medSchema = new Schema({
  dr_id: {
    type: mongoose.Types.ObjectId,
    ref:"User",
  },
  med: {
    type: String,
  },
  des:{
    type: String,
    default:"No discription"
  },
  time: { type: Date, default: Date.now },
});

const med = new mongoose.model("med", medSchema);
module.exports = med;
