const mongoose = require("mongoose");
const { Schema } = mongoose;
const tamplateSchema = new Schema({
  dr_id: {
    type: mongoose.Types.ObjectId,
    ref: "users",
  },
  D_Name: {
    type: String,
  },
  D_Overview: {
    type: String,
  },
  D_Causes: {
    type: [],
  },
  D_Syptoms: {
    type: [],
  },
  D_Treatments: {
    type: [],
  },
  D_Conclusion: {
    type: String,
  },
  D_Refrence: {
    type: String,
    default:"No Refrence"
  },
  status:{
    type:String,
    default:"Public"
  },
  rating:{
    type: String,
    default:"0"
  },
 
  time: { type: Date, default: Date.now },
 
});

const tamplate = new mongoose.model("Tamplate", tamplateSchema);
module.exports = tamplate;
