const userSchema = require("../Models/_UserModers");
const bcryptjs = require("bcryptjs");
const numSaltRounds = 10;

var jwt = require("jsonwebtoken");
const key = "shhhhh";

// -------- Register Route-----
const register = async (req, res) => {
  const file = req.file;

  let { fname, lname, email, password } = req.body;
  let imgname;
  const checksum = (patrn, name, msg) => {
    let result = patrn.test(name);
    if (result === false) {
      checksmessage.push({ status: "404", msg: msg });
    }
  };
  let checksmessage = [];

  if (!fname & !lname & !email & !password & !file) {
    checksmessage.push({
      status: "404",
      msg: "Please Fill All Reuired Fields",
    });
  } else {
    if (file) {
      const image_type = req.file.mimetype;
      if (
        image_type == "image/jpeg" ||
        image_type == "image/jpg" ||
        image_type == "image/png" ||
        image_type == "image/webp"
      ) {
        imgname = req.file.filename;
      } else {
        checksmessage.push({ status: "404", msg: "Invalid Image Fromate" });
      }
    } else {
      checksmessage.push({ status: "404", msg: "Enter image" });
    }

    if (!fname) {
      checksmessage.push({ status: "404", msg: "Please Enter First Name" });
    } else {
      let result = checksum(/[A-Za-z ]{3}/, fname, "Firstname Invalid *Abcd*");
    }
    if (!lname) {
      checksmessage.push({ status: "404", msg: "Please Enter Last Name" });
    } else {
      let result = checksum(/[A-Za-z ]{3}/, lname, "Lastname Invalid *Abcd*");
    }

    if (!email) {
      checksmessage.push({ status: "404", msg: "Please Enter Email" });
    } else {
      let result = checksum(
        /[a-zA-Z0-9_\-\.]+[@][a-z]+[\.][a-z]{3,3}/,
        email,
        " Invalid Email *Example@gmail.com*"
      );
    }
    if (!password) {
      checksmessage.push({ status: "404", msg: "Please Enter Password" });
    } else {
      let result = checksum(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{5,6})/,
        password,
        " Enter Strong Password *aB9@cs*"
      );
    }
  }
  //
  if (checksmessage.length > 0) {
    res.send({ checksmessage });
  } else {
    let exist_user = await userSchema.findOne({ email });
    if (!exist_user) {
      const hash = await bcryptjs.hash(password, numSaltRounds);
      let new_user = await userSchema.create({
        firstname: fname,
        lastname: lname,
        email,
        image: imgname,
        password: hash,
      });
      new_user = await new_user.save();

      if (new_user) {
        let checksmessage = [];
        console.log(new_user);
        checksmessage.push({
          status: "200",
          msg: "Registration Successfully!",
        });
        res.send({ checksmessage });
      }
    } else {
      let checksmessage = [];
      checksmessage.push({ status: "400", msg: "User Already Exist" });
      res.send({ checksmessage });
    }
  }

  //
};
// -------- Login Route-----

const login = async (req, res) => {
  const { email, password } = req.body;
  const log_user = await userSchema.findOne({ email });
  if (log_user) {
    let compareppass = await bcryptjs.compare(password, log_user.password);
    if (compareppass) {
      const new_user = {
        _id: log_user._id,
        firstname: log_user.firstname,
        lastname: log_user.lastname,
        email: log_user.email,
        time: log_user.time,
        __v: log_user.__v,
        image: log_user.image,
        clnincAddress: log_user.clnincAddress,
        clnincContact: log_user.clnincContact,
        clnincEducation: log_user.clnincEducation,
        clnincLience: log_user.clnincLience,
        clnincName: log_user.clnincName,
      };
      var token = await jwt.sign(new_user, "shhhhh");
      res.send({ status: "200", token });
    } else {
      res.send({ status: "404", error: "Invalid credentials" });
    }
  } else {
    res.send({ status: "404", error: "Invalid credentials" });
  }
};

// -------- Get User Single Detail Route-----
// http://localhost:4000/user/api/getuser
const getSingleuser = async (req, res) => {
  try {
    const id = req.user._id;
    const user = await userSchema.findById(id).select("-password");
    if (!user) {
      res.json({ status: "401", error: "Invalid User" });
    } else {
      res.json({ status: "200", user });
    }
  } catch (error) {
    res.json({ status: "401", error: "Internal Server Error" });
  }
};
const clinic_setUp = async (req, res) => {
  const id = req.user._id;
  console.log(id, req.body);
  try {
    let Data = {
      clnincName: req.body.cl_name,
      clnincAddress: req.body.cl_address,
      clnincContact: req.body.cl_contact,
      clnincEducation: req.body.cl_desig,
      clnincLience: req.body.cl_license,
    };
    let _user = await userSchema.findByIdAndUpdate(
      { _id: id },
      { $set: Data },
      { new: true }
    );
    if (_user) {
      console.log(_user);
      return res.send({ status: "200", msg: "Save Successfully!" });
    }
  } catch (error) {
    return res.send({ status: "404", msg: "Something went wrong" });
  }
};
module.exports = { register, login, getSingleuser, clinic_setUp };
