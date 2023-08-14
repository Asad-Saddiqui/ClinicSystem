const mongoose = require("mongoose");
const { Schema } = mongoose;
const dise = new Schema({
  dr_id: {
    type: mongoose.Types.ObjectId,
    ref:"User",
  },
  dise: {
    type: String,
  },
  des:{
    type: String,
    default:"No discription"
  },
  time: { type: Date, default: Date.now },
});

const deseases = new mongoose.model("desease", dise);
module.exports = deseases;
