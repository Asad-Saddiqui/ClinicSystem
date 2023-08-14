const express = require('express');
const router = express.Router()

const Prescription = require('../Controllers/Prescription')
const auth_user = require('../Middleware/getuser')
// http://localhost:4000/prescription/api/create/prescription/34534534
router.post('/create/prescription/:pid',auth_user,Prescription.createPrescription)
// http://localhost:4000/prescription/api/view/prescription/34534534
router.get('/view/prescription/:pid',auth_user,Prescription.viewPrescription)
// http://localhost:4000/prescription/api/delete/prescription/34534534
router.delete('/delete/prescription/:pr_id',auth_user,Prescription.deletePrescription)
// http://localhost:4000/prescription/api/saveHistory/prescription/34534534
router.post('/saveHistory/prescription/:pid',auth_user,Prescription.SaveHistoryPrescription)

module.exports = router