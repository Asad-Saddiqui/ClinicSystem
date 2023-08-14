const express = require('express');
const router = express.Router()
const multer  = require('multer')
const userControllers = require('../Controllers/UserControllers')
const getuser = require("../Middleware/getuser")
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  });
const upload = multer({ storage: storage });

// http://localhost:4000/user/api/register
router.post('/register',upload.single("image"),userControllers.register)
// http://localhost:4000/user/api/login
router.post('/login',userControllers.login)
// http://localhost:4000/user/api/getuser
// http://localhost:4000/user/api/clinic
router.get('/getuser',getuser,userControllers.getSingleuser)
router.put('/clinic',getuser,userControllers.clinic_setUp)

module.exports = router