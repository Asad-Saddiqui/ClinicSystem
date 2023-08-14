const mongoose = require("mongoose");
const { Schema } = mongoose;
const prescriptionSchema = new Schema(
  {
    dr_id: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    patient_id: {
      type: mongoose.Types.ObjectId,
      ref: "Patients",
    },
    issueDate: {
      type: String,
    },
    instractions: [],
    medicens: [],
    diseases: [],
    additionalNotes: {
      type: String,
      default: " ",
    },
    prescription_no: {
      type: Number,
      default: "1",
    },
  },
  {
    timestamps: true, // This option will add "createdAt" and "updatedAt" fields automatically
  }
);

const prescription = new mongoose.model("prescription", prescriptionSchema);
module.exports = prescription;
