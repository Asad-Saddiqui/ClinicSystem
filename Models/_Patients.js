const mongoose = require("mongoose");
const { Schema } = mongoose;
const PatientsSchema = new Schema({
  dr_id: {
    type: mongoose.Types.ObjectId,
    ref:"User",
  },
  patName: {
    type: String,
  },
 
  patAge: {
    type: String,
  },
  PatAddress: {
    type: String,
  },
  patDob: {
    type: String,
  },
  patGender: {
    type: String,
  },
  pID:{
    type: String,
  },

  time: { type: Date, default: Date.now },
});

const Patients = new mongoose.model("Patients", PatientsSchema);
module.exports = Patients;
