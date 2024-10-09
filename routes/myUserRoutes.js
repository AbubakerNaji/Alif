
const express = require('express');
const myuserController = require('../controllers/myUserController');
const {setFilter} = require('../controllers/handlerFactory');
const {protected} = require('../utils/middleware/protected');
const upload =  require('../controllers/multiController')
const router = express.Router();

router.get('/' ,protected,setFilter, myuserController.getUserLoggedIn);
router.delete('/',protected, myuserController.deleteUser);
router.put('/',protected, upload.single("image") , myuserController.updateUser);
router.patch("/updatePassword", protected, myuserController.updatePassword);

module.exports = router