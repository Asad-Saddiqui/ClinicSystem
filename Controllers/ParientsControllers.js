const userSchema = require("../Models/_UserModers");
const patientSchema = require("../Models/_Patients");
const ___med = require("../Models/_medcines");
const _prescription = require("../Models/_prescription");
const mongoose = require("mongoose");

//---------------POST Patients---------------
const addpatients = async (req, res) => {
  try {
    let errors = [];
    let id = req.user._id;
    let P_ID = Date.now();
    let { name, age, address, dob, value } = req.body;
    if (mongoose.Types.ObjectId.isValid(id)) {
      id = req.user._id;
    } else {
      return res.send({ status: "404", msg: "Invalid Credential" });
    }
    if (!name) {
      return res.send({ status: "404", msg: "Please Enter Patient Name" });
    }
    if (!age) {
      return res.send({ status: "404", msg: "Please Enter Patient Age" });
    }
    if (!address) {
      return res.send({ status: "404", msg: "Please Enter Patient Address" });
    }
    if (!value) {
      return res.send({ status: "404", msg: "Please Enter Patient Gender" });
    }
    if (!dob) {
      return res.send({ status: "404", msg: "Please Enter Patient DOB" });
    }
    if (errors.length > 0) {
      return res.send({ errors });
    } else {
      let Patients = {
        dr_id: id,
        patName: name,
        patAge: age,
        PatAddress: address,
        patDob: dob,
        patGender: value,
        pID: P_ID,
      };

      let patients = await patientSchema.create(Patients);
      patients.save();
      if (patients) {
        return res.send({
          status: "200",
          msg: "Patients Inserted SuccessFully!",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

//---------------GET Patients---------------
const getPatients = async (req, res) => {
  try {
    let id = req.user._id;
    if (mongoose.Types.ObjectId.isValid(id)) {
      id = req.user._id;
    } else {
      return res.send({ status: "404", msg: "Invalid Credential" });
    }
    let data = await patientSchema.find({ dr_id: id }).sort({ time: -1 });
    let overAllPat = await patientSchema.find();
    let pat_len = overAllPat.length;
    if (data) {
      // const totalRows = await patientSchema.countDocuments();
      res.json({ data, totalRows: data.length, pat_len });
    }
  } catch (error) {
    console.log(error);
  }
};

const deletePatients = async (req, res) => {
  let _id = req.params.id;
  if (mongoose.Types.ObjectId.isValid(_id)) {
    const dr_id = req.user._id;

    let patients = await patientSchema.findById(_id);
    let did = patients.dr_id;
    if (did.toHexString() === dr_id) {
      let pat = await patientSchema.findByIdAndDelete({ _id });
      return res
        .status(200)
        .json({ status: "200", msg: "Deleted Successfully !" });
    } else {
      return res.status(200).json({ status: "404", msg: "Invalid User ID !" });
    }
  } else {
    return res.status(200).json({ msg: "Invalid User ID !" });
  }
};
// http://localhost:4000/patients/api/getSinglePatients

const getSinglePatients = async (req, res) => {
  let id = req.params.id;
  const dr_id = req.user._id;
  try {
    let patients = await patientSchema.findById({ _id: id });
    let did = patients.dr_id;
    if (did.toHexString() === dr_id) {
      let result = await patientSchema.findById({ _id: id });
      if (result) {
        res.status(200).json({ data: result });
      }
    }
  } catch (error) {
    res.status(404).json({ data: "Invalid api hit" });
  }
};
// http://localhost:4000/patients/api/updatepatients
const updatePatients = async (req, res) => {
  let id = req.params.id;
  const dr_id = req.user._id;
  let data = {
    patGender: req.body.gender,
    patName: req.body.name,
    patAge: req.body.age,
    PatAddress: req.body.address,
    patDOb: req.body.value,
  };
  try {
    let patients = await patientSchema.findById({ _id: id });
    let did = patients.dr_id;
    if (did.toHexString() === dr_id) {
      let user = await patientSchema.findByIdAndUpdate({ _id: id }, data, {
        new: true,
      });
      if (user) {
        res.status(200).json({ status: "200", msg: "Updated Successfully!" });
      }
    }
  } catch (error) {
    res.status(404).json({ data: "Something Wrong" });
  }
};
// const prescription = async (req, res) => {
//   let id = req.user._id;
//   // dr_id
//   let pid = req.params.id;
//   function isValidObjectId(id) {
//     return mongoose.Types.ObjectId.isValid(id);
//   }

//   // Example usage
//   const idToCheck = pid; // Replace this with the ID you want to check

//   if (isValidObjectId(idToCheck)) {
//     let result___ = await _prescription.aggregate([
//       {
//         $match: { $expr: { $eq: ["$_id", { $toObjectId: pid }] } }, // Convert userId to ObjectId
//       },
//       {
//         $lookup: {
//           from: "users", // Target collection (users)
//           localField: "dr_id", // Field in the current collection (posts) that refers to the foreign key
//           foreignField: "_id", // Field in the target collection (users) that is referenced by the localField
//           as: "user_data", // Name of the new field to store the matched user data
//         },
//       },
//       {
//         $unwind: "$user_data", // Unwind the array from the lookup to get a single document
//       },
//       {
//         $project: {
//           "user_data.password": 0, // Exclude the 'email' field from 'user_data'
//         },
//       },
//       {
//         $lookup: {
//           from: "deseases", // Target collection (users)
//           localField: "deases_id", // Field in the current collection (comments) that refers to the user foreign key
//           foreignField: "_id", // Field in the target collection (users) that is referenced by the localField
//           as: "desease", // Name of the new field to store the matched user data within the comments
//         },
//       },
//       {
//         $lookup: {
//           from: "meds", // Target collection (users)
//           localField: "medicensId", // Field in the current collection (comments) that refers to the user foreign key
//           foreignField: "_id", // Field in the target collection (users) that is referenced by the localField
//           as: "medicensData", // Name of the new field to store the matched user data within the comments
//         },
//       },
//       {
//         $lookup: {
//           from: "patients", // Target collection (users)
//           localField: "patient_id", // Field in the current collection (comments) that refers to the user foreign key
//           foreignField: "_id", // Field in the target collection (users) that is referenced by the localField
//           as: "Patients_data", // Name of the new field to store the matched user data within the comments
//         },
//       },
//     ]);
//     res.send({ result___ });
//     console.log({ result___ });
//   } else {
//     res.send({ status: "404", msg: "Invalid ID" });
//     console.log("Invalid ID.");
//   }
// };

module.exports = {
  addpatients,
  // prescription,
  getPatients,
  deletePatients,
  updatePatients,
  getSinglePatients,
};
