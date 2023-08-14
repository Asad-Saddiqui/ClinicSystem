const ___med = require("../Models/_medcines");
const dise = require("../Models/disease");
const _prescription = require("../Models/_prescription");
const mongoose = require("mongoose");
// Create Prescription
const createPrescription = async (req, res) => {
  console.log("Call createPrescription prescription")

  let Pid = req.params.pid;
  let pr_id = req.params.pr_id;
  if (!mongoose.Types.ObjectId.isValid(Pid)) {
    return res.send({ status: "404", msg: "Invalid Patient ID" });
  }
  let newmedarray = Array.from(new Set(req.body.data.chips));
  // if (!newmedarray.length > 0) {
  //   return res.send({ status: "404", msg: "Please Enter Medcines" });
  // }
  let newmedarray2 = Array.from(new Set(req.body.data.chips2));

  let instructions = req.body.data.instructions;
  let additionalNotes = req.body.data.aditionalNotes;
  if (!instructions.trim()) {
    return res.send({ status: "404", msg: "Please Enter Some Instructions" });
  }

  const currentTimestamp = Date.now();
  const currentDate = new Date(currentTimestamp);
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // Adding 1 because months are zero-based (0 = January)
  const day = currentDate.getDate();

  // Format the date components as a string in "YYYY-MM-DD" format
  const formattedDates = `${year}-${month.toString().padStart(2, "0")}-${day
    .toString()
    .padStart(2, "0")}`;
  // console.log(formattedDates);

  let p_no = await _prescription
    .findOne({ patient_id: Pid, dr_id: req.user._id })
    .sort({ createdAt: -1 }) // Sort in descending order of createdAt
    .limit(1);
  let P_NO = 1;
  if (p_no) {
    p_no = p_no.prescription_no;
    P_NO = parseInt(p_no + P_NO);
  }
  let data_prescription = {
    dr_id: req.user._id,
    patient_id: Pid,
    issueDate: formattedDates,
    instractions: instructions,
    medicens: newmedarray,
    diseases: newmedarray2,
    additionalNotes: additionalNotes,
    prescription_no: P_NO,
  };

  let prescription = await _prescription.create(data_prescription);
  prescription.save();
  if (prescription) {
    if (newmedarray.length > 0) {
      let med_exist_id = [];
      const Exist_meds = await ___med.find({
        dr_id: req.user._id,
        med: { $in: newmedarray },
      });
      console.log({ Exist_meds });
      for (let index = 0; index < Exist_meds.length; index++) {
        med_exist_id.push(Exist_meds[index]._id);
      }
      const Exist_medsNames = new Set(Exist_meds.map((keys) => keys.med));
      const missingmeds = newmedarray.filter(
        (keys) => !Exist_medsNames.has(keys)
      );
      let meds_overAll_id = [...med_exist_id];
      if (missingmeds.length > 0) {
        const newmeds = missingmeds.map((keys) => ({
          dr_id: req.user._id,
          med: keys,
        }));
        let newmeds__ = await ___med.insertMany(newmeds);
        if (newmeds__) {
          // console.log(newmeds__);
        }
        let insert_meds_des_id = [];
        newmeds__.map((keys) => {
          insert_meds_des_id.push(keys._id);
        });
        meds_overAll_id = [...insert_meds_des_id, ...med_exist_id];
        // console.log(meds_overAll_id);
      }
    }

    if (newmedarray2.length > 0) {
      let dise_exist_id = [];
      const Exist_dise = await dise.find({ dr_id:req.user._id,dise: { $in: newmedarray2 } });
      // console.log({ Exist_dise });
      for (let index = 0; index < Exist_dise.length; index++) {
        dise_exist_id.push(Exist_dise[index]._id);
      }
      const Exist_diseNames = new Set(Exist_dise.map((keys) => keys.dise));
      const missingdise = newmedarray2.filter(
        (keys) => !Exist_diseNames.has(keys)
      );
      let dise_overAll_id = [...dise_exist_id];

      if (missingdise.length > 0) {
        const newdise = missingdise.map((keys) => ({
          dr_id: req.user._id,
          dise: keys,
        }));
        let newdise__ = await dise.insertMany(newdise);
        if (newdise__) {
          // res.status(200).json({ status: "200", msg: "Inserted Successfully !" });
          // console.log(newdise__);
        }
        let insert_dise_des_id = [];
        newdise__.map((keys) => {
          insert_dise_des_id.push(keys._id);
        });
        dise_overAll_id = [...dise_exist_id, ...insert_dise_des_id];
        // console.log(dise_overAll_id);
      }
    }

    // console.log(prescription);
    return res.send({
      status: "200",
      msg: "Save Prtescription Successfully !",
    });
  }
};
// View Prescription

const viewPrescription = async (req, res) => {
  console.log("Call viewPrescription prescription")

  let dr_id = req.user._id;
  let pid = req.params.pid;
  let data = await _prescription.find({ dr_id: dr_id, patient_id: pid });
  if (data) {
    return res.send({ data: data, totalRows: data.length });
  }
};

const deletePrescription = async (req, res) => {
  console.log("Call deletePrescription prescription")

  let pr_id = req.params.pr_id;
  let result = await _prescription.findByIdAndDelete({
    _id: pr_id,
    dr_id: req.user._id,
  });
  if (result) {
    res.send({ status: "200", msg: "Deleted Successfully !" });
  } else {
    res.send({ status: "404", msg: "Invalid Credientials" });
  }
};
const SaveHistoryPrescription = async (req, res) => {
  console.log("Call SaveHistroy prescription")
  let Pid = req.params.pid;
  if (!mongoose.Types.ObjectId.isValid(Pid)) {
    return res.send({ status: "404", msg: "Invalid Patient ID" });
  }
  let newmedarray = Array.from(new Set(req.body.data.chips));
  // if (!newmedarray.length > 0) {
  //   return res.send({ status: "404", msg: "Please Enter Medcines" });
  // }

  let newmedarray2 = Array.from(new Set(req.body.data.chips2));

  let instructions = req.body.data.instructions;
  let additionalNotes = req.body.data.aditionalNotes;
  if (!instructions.trim()) {
    return res.send({ status: "404", msg: "Please Enter Some Instructions" });
  }

  const currentTimestamp = Date.now();
  const currentDate = new Date(currentTimestamp);
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // Adding 1 because months are zero-based (0 = January)
  const day = currentDate.getDate();

  // Format the date components as a string in "YYYY-MM-DD" format
  const formattedDates = `${year}-${month.toString().padStart(2, "0")}-${day
    .toString()
    .padStart(2, "0")}`;
  // console.log(formattedDates);

  let p_no = await _prescription
    .findOne({ patient_id: Pid, dr_id: req.user._id })
    .sort({ createdAt: -1 }) // Sort in descending order of createdAt
    .limit(1);
  let P_NO = 1;
  if (p_no) {
    p_no = p_no.prescription_no;
    P_NO = parseInt(p_no + P_NO);
  }
  let data_prescription = {
    dr_id: req.user._id,
    patient_id: Pid,
    issueDate: formattedDates,
    instractions: instructions,
    medicens: newmedarray,
    diseases: newmedarray2,
    additionalNotes: additionalNotes,
    prescription_no: P_NO,
  };

  let prescription = await _prescription.create(data_prescription);
  prescription.save();
  if (prescription) {
    if (newmedarray.length > 0) {
      let med_exist_id = [];
      const Exist_meds = await ___med.find({
        dr_id: req.user._id,
        med: { $in: newmedarray },
      });
      console.log("//jkhjkjhjkhj");
      res.send({
        status: "200",
        msg: "Save Successfully !",
      });
      for (let index = 0; index < Exist_meds.length; index++) {
        med_exist_id.push(Exist_meds[index]._id);
      }
      const Exist_medsNames = new Set(Exist_meds.map((keys) => keys.med));
      const missingmeds = newmedarray.filter(
        (keys) => !Exist_medsNames.has(keys)
      );
      let meds_overAll_id = [...med_exist_id];
      if (missingmeds.length > 0) {
        const newmeds = missingmeds.map((keys) => ({
          dr_id: req.user._id,
          med: keys,
        }));
        let newmeds__ = await ___med.insertMany(newmeds);
        if (newmeds__) {
          // console.log(newmeds__);
        }
        let insert_meds_des_id = [];
        newmeds__.map((keys) => {
          insert_meds_des_id.push(keys._id);
        });
        meds_overAll_id = [...insert_meds_des_id, ...med_exist_id];
        // console.log(meds_overAll_id);
      }
    }

    if (newmedarray2.length > 0) {
      let dise_exist_id = [];
      const Exist_dise = await dise.find({
        dr_id: req.user._id,
        dise: { $in: newmedarray2 },
      });
      // console.log({ Exist_dise });
      for (let index = 0; index < Exist_dise.length; index++) {
        dise_exist_id.push(Exist_dise[index]._id);
      }
      const Exist_diseNames = new Set(Exist_dise.map((keys) => keys.dise));
      const missingdise = newmedarray2.filter(
        (keys) => !Exist_diseNames.has(keys)
      );
      let dise_overAll_id = [...dise_exist_id];

      if (missingdise.length > 0) {
        const newdise = missingdise.map((keys) => ({
          dr_id: req.user._id,
          dise: keys,
        }));
        let newdise__ = await dise.insertMany(newdise);
        if (newdise__) {
          // res.status(200).json({ status: "200", msg: "Inserted Successfully !" });
          // console.log(newdise__);
        }
        let insert_dise_des_id = [];
        newdise__.map((keys) => {
          insert_dise_des_id.push(keys._id);
        });
        dise_overAll_id = [...dise_exist_id, ...insert_dise_des_id];
        // console.log(dise_overAll_id);
      }
    }

    // console.log(prescription);
  }
};

module.exports = {
  createPrescription,
  viewPrescription,
  deletePrescription,
  SaveHistoryPrescription,
};
