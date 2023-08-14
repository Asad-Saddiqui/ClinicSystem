const mongoose = require('mongoose')
const { Schema } = mongoose;
const userSchema = new Schema({
  firstname: {
    type: String,
  },
  lastname: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  image:{
  type:String
  },
  clnincName:{
    type:String,
    default:'Your Clinic'
  },
  clnincAddress:{
    type:String,
    default:'Your Address'

  },
  clnincContact:{
    type:String,
    default:'Your Contact'

  },
  clnincEducation:{
    type:String,
    default:'Your Education'

  },
  clnincLience:{
    type:String,
    default:'Your Licence'

  },
  time: { type: Date, default: Date.now },
});

const User = new mongoose.model("User", userSchema)
module.exports = User