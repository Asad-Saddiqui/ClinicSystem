const express = require('express');
const router = express.Router()

const medControllers = require('../Controllers/Medcines')
const getuser = require('../Middleware/getuser')



// http://localhost:4000/med/api/addMedcines
router.post('/addMedcines',getuser,medControllers.addmed)
router.get('/viewmedcines',getuser,medControllers.viewmed)
router.put('/update/:id',getuser,medControllers.medupdate)
router.delete('/delete/:id',getuser,medControllers.meddelete)


module.exports = router