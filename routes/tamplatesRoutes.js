const express = require('express');
const router = express.Router()

const TamplateControllers = require('../Controllers/Tamplate')
const auth_user = require('../Middleware/getuser')

router.post('/create/tamplates',auth_user,TamplateControllers.create_tamplates)
router.get('/view/tamplates',auth_user,TamplateControllers.view_tamplates)
router.get('/public/view/tamplates',auth_user,TamplateControllers.public_view_tamplates)
router.delete('/delete/tamplates/:id',auth_user,TamplateControllers.delete_tamplates)
router.get('/single/tamplates/:id',auth_user,TamplateControllers.single_tamplates)
router.put('/edit/tamplates/:id',auth_user,TamplateControllers.edit_temp)
router.put('/status/tamplates/:id',auth_user,TamplateControllers.status)
router.put('/rating/tamplates/:id',auth_user,TamplateControllers.rating)
router.post('/asign/tamplates/:id/:id2',auth_user,TamplateControllers.asignTemplate)

// router.put('/edit/tamplates/:id',TamplateControllers.edit_tamplates)
// router.get('/viewmedcines',medControllers.viewmed)
// router.put('/update/:id',medControllers.medupdate)
// router.delete('/delete/:id',medControllers.meddelete)


module.exports = router