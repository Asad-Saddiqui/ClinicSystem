const express = require('express');
const router = express.Router()
const user_auth = require("../Middleware/getuser")
const Patients_controllers = require('../Controllers/ParientsControllers')


router.post('/addPatients',user_auth,Patients_controllers.addpatients)
router.get('/Patients',user_auth,Patients_controllers.getPatients)
router.delete('/delete/:id',user_auth,Patients_controllers.deletePatients)
router.get('/getSinglePatients/:id',user_auth,Patients_controllers.getSinglePatients)
router.put('/updatepatients/:id',user_auth,Patients_controllers.updatePatients)
// router.get('/prescription/:id',user_auth,Patients_controllers.prescription)


module.exports = router
