const ___med = require("../Models/_medcines");
const mongoose = require("mongoose");
const addmed = async (req, res) => {
  // const id = req.user._id;
  // console.log(req.body);
  // res.send({ data: req.body });
  let medcines_ = req.body.myArray1;
  // console.log(req.body)
  let meds_overAll_id = [];
  let med_exist_id = [];
  // res.status(404).json({ status: "404", msg: "On Working" });
  // console.log(medcines_);

  const getUniqueObjectsById = (array) => {
    const uniqueIdsSet = new Set();
    const uniqueObjectsArray = [];

    for (const item of array) {
      if (!uniqueIdsSet.has(item.medname)) {
        uniqueIdsSet.add(item.medname);
        uniqueObjectsArray.push(item);
      }
    }

    return [uniqueIdsSet, uniqueObjectsArray];
  };

  const uniqueObjects = getUniqueObjectsById(medcines_);
  // let Medcines_array = Array.from(uniqueObjects);
  let newmedarray = Array.from(uniqueObjects[0]);
  let new_meddes = uniqueObjects[1];

  try {
    if (newmedarray.length > 0) {
      const Exist_meds = await ___med.find({
        dr_id: req.user._id,
        med: { $in: newmedarray },
      });
      console.log({ Exist_meds });
      console.log({ msg: "no" });
      const Exist_medsNames = new Set(Exist_meds.map((keys) => keys.med));
      if (Exist_meds.length > 0) {
      }
      for (let index = 0; index < Exist_meds.length; index++) {
        med_exist_id.push(Exist_meds[index]._id);
      }

      const missingmeds = newmedarray.filter(
        (keys) => !Exist_medsNames.has(keys)
      );
      // console.log({ missingmeds });
      // console.log({ Exist_medsNames });
      meds_overAll_id = [...med_exist_id];

      if (missingmeds.length > 0) {
        const insert_meds_des = new_meddes.filter(
          (keys) => !Exist_medsNames.has(keys.medname)
        );
        const newmeds = insert_meds_des.map((keys) => ({
          dr_id: req.user._id,
          med: keys.medname,
          des: keys.des,
        }));
        let newmeds__ = await ___med.insertMany(newmeds);
        if (newmeds__) {
          res
            .status(200)
            .json({ status: "200", msg: "Inserted Successfully !" });
        }
      } else {
        res.status(200).json({ status: "200", msg: "Alrady Exist" });
      }
    } else {
      res.status(404).json({ status: "404", msg: "Please Enter Medcines" });
    }
  } catch (error) {
    res.status(404).json({ status: "404", msg: "Connectivity Error" });
  }
};
const viewmed = async (req, res) => {
  let id = req.user._id;
  let all_med = await ___med.find({ dr_id: id });
  let overall_med = await ___med.find();
  if (all_med) {
    res.send({
      status: "200",
      data: all_med,
      totalRows: all_med.length,
      med_length: overall_med.length,
    });
  }
};
const medupdate = async (req, res) => {
  // http://localhost:4000/Med/api/update/
  // res.send({ status: "200" });
  // console.log("working");
  let id = req.params.id;
  let { editmedname, editdes } = req.body.med_u;
  console.log(editdes);
  try {
    let for_update = {
      med: editmedname,
      des: editdes,
    };
    let updated_med = await ___med.findById({ _id: id });
    let dr_id = updated_med.dr_id;
    if (dr_id.toHexString() === req.user._id) {
      updated_med = await ___med.findByIdAndUpdate(
        { _id: id },
        { $set: for_update },
        {
          new: true,
        }
      );
      if (updated_med) {
        return res.json({ status: "200", msg: "Updated Successfully !" });
      }
    }
  } catch (error) {
    console.log(error);
  }
};
const meddelete = async (req, res) => {
  let id = req.params.id;
  let drid = req.user._id;
  try {
    let de_med = await ___med.findById({ _id: id });
    let dr_id = de_med.dr_id;
    if (dr_id.toHexString() === drid) {
      let delete_med = await ___med.findByIdAndDelete({ _id: id });
      if (delete_med) {
        return res.json({ status: "200", msg: "Deleted Successfully!" });
      }
    }
  } catch (error) {
    console.log(error);
  }
};
module.exports = { addmed, viewmed, medupdate, meddelete };
