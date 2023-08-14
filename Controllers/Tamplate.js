const tamplate = require("../Models/_Tamplates");
const _Patients = require("../Models/_Patients");
const AsignTamplates = require("../Models/AsignTamplates");
const _Ratings = require("../Models/_Ratings");
// --------- Create Tamplates----------------

const create_tamplates = async (req, res) => {
  const did = req.user._id;
  try {
    let {
      diseasename,
      diseaseOverview,
      Conclusion,
      diseaseRef,
      diseaseCauses,
      diseaseSymptoms,
      diseaseTreatments,
    } = req.body.data;
    if (!diseasename) {
      return res.send({ status: "404", msg: "Please Enter Disease Name" });
    }
    if (!diseaseOverview) {
      return res.send({ status: "404", msg: "Please Enter Disease Overview" });
    }
    if (!diseaseCauses.length > 0) {
      return res.send({ status: "404", msg: "Please Enter Disease Causes" });
    }
    if (!diseaseSymptoms.length > 0) {
      return res.send({ status: "404", msg: "Please Enter Disease Symptoms" });
    }
    if (!diseaseTreatments.length > 0) {
      return res.send({
        status: "404",
        msg: "Please Enter Disease Treatments",
      });
    }
    if (!Conclusion) {
      return res.send({
        status: "404",
        msg: "Please Enter Disease Conclusion",
      });
    }
    let dr_id = did;
    let Tamplates_ = {
      dr_id,
      D_Name: diseasename,
      D_Overview: diseaseOverview,
      D_Causes: diseaseCauses,
      D_Syptoms: diseaseSymptoms,
      D_Treatments: diseaseTreatments,
      D_Conclusion: Conclusion,
      D_Refrence: diseaseRef,
    };
    let exist_tamp = await tamplate.find({ D_Name: diseasename });
    console.log(exist_tamp);
    if (!exist_tamp.length > 0) {
      let result = await tamplate.create(Tamplates_);
      result.save();
      if (result) {
        // console.log(result);
        return res.send({ status: "200", msg: "Created Successfully !" });
      }
    } else {
      return res.send({ status: "404", msg: "Already Exist !" });
    }
  } catch (error) {
    return res.send({ status: "404", msg: "Something  wrong" });
  }
};

// --------- View Tamplates----------------
const view_tamplates = async (req, res) => {
  const did = req.user._id;
  let dr_id = did;
  let tamplates = await tamplate.find({ dr_id });
  let PrivateTamplates = await tamplate.find({ dr_id,status:'Private' });
  res.send({ data: tamplates, totalRows: tamplates.length,pri_len:PrivateTamplates.length });

  // console.log(tamplates);
};
// --------- pUBLICK Tamplates----------------
const public_view_tamplates = async (req, res) => {
  // const did = req.user._id;
  // let dr_id = did;
  let tamplates = await tamplate.aggregate([
    {
      $match: {
        status: "Public", // Convert the bookId to ObjectId type
      },
    },
    {
      $lookup: {
        from: "users", // Target collection name (case-sensitive)
        localField: "dr_id", // Field from the Book collection
        foreignField: "_id", // Field from the Author collection
        as: "author", // Alias to store the author information
      },
    },
    {
      $unwind: "$author", // Deconstructs the author array to a single object
    },
  ]);
  res.send({ data: tamplates, totalRows: tamplates.length });
  // console.log(tamplates);
};
const delete_tamplates = async (req, res) => {
  let id = req.params.id;
  const did = req.user._id;
  try {
    let tamplates = await tamplate.findById({ _id: id });
    dr_id = tamplates.dr_id;
    if (dr_id.toHexString() === did) {
      tamplates = await tamplate.findByIdAndDelete({ _id: id });
      if (tamplates) {
        res.send({ status: "200", msg: "Deleted Successfully" });
      } else {
        res.send({ status: "404", msg: "Invalid ID" });
      }
    } else {
      res.send({ status: "404", msg: "Invalid ID" });
    }
  } catch (error) {
    res.send({ status: "404", msg: "Invalid ID" });
  }
};
const single_tamplates = async (req, res) => {
  let id = req.params.id;
  let did = req.user._id;
  try {
    let tamplates = await tamplate.findOne({ _id: id });
    let drid = tamplates.dr_id;
    // console.log(drid);
    if (drid.toHexString() === did) {
      tamplates = await tamplate.findOne({ _id: id });
      if (tamplates) {
        res.send({ status: "200", data: tamplates });
      } else {
        res.send({ status: "404", msg: "Invalid ID" });
      }
    } else {
      res.send({ status: "404", msg: "Invalid ID" });
    }
  } catch (error) {
    res.send({ status: "404", msg: "Something Went Wrong" });
  }
};
const edit_temp = async (req, res) => {
  let did = req.user._id;
  try {
    let {
      diseasename,
      diseaseOverview,
      Conclusion,
      diseaseRef,
      diseaseCauses,
      diseaseSymptoms,
      diseaseTreatments,
    } = req.body.data;
    let dr_id = did;
    let Tamplates_ = {
      D_Name: diseasename,
      D_Overview: diseaseOverview,
      D_Causes: diseaseCauses,
      D_Syptoms: diseaseSymptoms,
      D_Treatments: diseaseTreatments,
      D_Conclusion: Conclusion,
      D_Refrence: diseaseRef,
    };
    const id = req.params.id;
    let temp = await tamplate.findById({ _id: id });
    let drid = temp.dr_id;
    if (drid.toHexString() === dr_id) {
      temp = await tamplate.findByIdAndUpdate(
        { _id: id },
        { $set: Tamplates_ },
        { new: true }
      );
      if (temp) {
        return res.send({ status: "200", msg: "Updated SUccessfully !" });
        // console.log(temp)
      } else {
        return res.send({ status: "404", msg: "Invalid ID" });
      }
    } else {
      return res.send({ status: "404", msg: "Invalid ID" });
    }
  } catch (error) {
    return res.send({ status: "404", msg: "Invalid ID" });
  }
};
const status = async (req, res) => {
  let id = req.params.id;
  let did = req.user._id;
  let status_ = req.body.status_;
  let status = {
    status: status_,
  };
  try {
    let data = await tamplate.findById({ _id: id });
    let dr_id = data.dr_id;
    if (dr_id.toHexString() === did) {
      data = await tamplate.findByIdAndUpdate(
        { _id: id },
        { $set: status },
        { new: true }
      );
      if (data) {
        return res.send({
          status: "200",
          msg: `Now your tamplate is ${status.status}`,
        });
      } else {
        return res.send({ status: "404", msg: `Some Error` });
      }
    } else {
      return res.send({ status: "404", msg: `Some Error` });
    }
  } catch (error) {}
};
const asignTemplate = async (req, res) => {
  let pid = req.params.id;
  let Tid2 = req.params.id2;
  let did = req.user._id;
  //tamplate
  // _Patients
  let checkTemp = await tamplate.findOne({ _id: Tid2 });
  if (checkTemp) {
    let checkpat = await _Patients.findOne({ _id: pid });
    if (checkpat) {
      let CheckasignTemp = await AsignTamplates.findOne({
        tamp_id: Tid2,
        patient_id: pid,
      });
      if (CheckasignTemp) {
        return res.send({ status: "404", msg: "Already Asign to Patients" });
      } else {
        let asignTemp = await AsignTamplates.create({
          dr_id: did,
          patient_id: pid,
          tamp_id: Tid2,
        });
        asignTemp.save();
        if (asignTemp) {
          console.log(asignTemp);
          return res.send({ status: "200", msg: "on working" });
        }
      }
    } else {
      return res.send({ status: "404", msg: "Patient not Exist" });
    }
  } else {
    return res.send({ status: "404", msg: "Tamplate not Exist" });
  }
};
const rating = async (req, res) => {
  const id = req.params.id;
  const did = req.user._id;
  const { value } = req.body;

  if (value) {
    let rat = await _Ratings.findOne({ dr_id:did,t_id: id });
    let data = {
      dr_id: did,
      t_id: id,
      rating: value,
    };
    if (rat) {
      let rate = await _Ratings.findByIdAndUpdate(
        { _id: rat._id },
        { $set: data },
        { new: true }
      );
      console.log("Ipdate", rate);
      res.send({
        status: "200",
        msg: `Successfull Updated ${value} Star ratings`,
      });
    } else {
      let rate = await _Ratings.create(data);
      res.send({
        status: "200",
        msg: `Successfull Submited ${value} Star ratings`,
      });
      rate.save();
      console.log({ rate });
    }
    // let averageratings = await tamplate
    // let averageratings =
    let all_ratings = await _Ratings.find({t_id: id });
    // console.log({ all_ratings });
    function calculateAverageRating(ratings) {
      if (!Array.isArray(ratings) || ratings.length === 0) {
        return 0;
      }

      const totalRatings = ratings.reduce(
        (sum, rating) => sum + parseInt(rating.rating),
        0
      );
      const averageRating = totalRatings / ratings.length;
      return averageRating;
    }

    // const ratings = [4, 5, 3, 4, 5];
    const averageRating = calculateAverageRating(all_ratings);
    let data_rat = {
      rating: averageRating,
    };
    // console.log('Average Rating:', averageRating);
    let rating_average = await tamplate.findByIdAndUpdate(
      { _id: id },
      { $set: data_rat },
      { new: true }
    );
    console.log({ rating_average });
  } else {
    return res.send({
      status: "404",
      msg: `Empty Five Stars Ratings`,
    });
  }
};

module.exports = {
  create_tamplates,
  view_tamplates,
  delete_tamplates,
  single_tamplates,
  edit_temp,
  status,
  asignTemplate,
  public_view_tamplates,
  rating,
};
