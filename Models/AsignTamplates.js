const mongoose = require("mongoose");
const { Schema } = mongoose;
const Temptopatient = new Schema({
  dr_id: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  patient_id: {
    type: mongoose.Types.ObjectId,
    ref: "Patients",
  },
  tamp_id: {
    type: mongoose.Types.ObjectId,
    ref: "Tamplate",
  },
  time: { type: Date, default: Date.now },
});

const Temptopatient_ = new mongoose.model("asignTemptopatient", Temptopatient);
module.exports = Temptopatient_;
