
const express = require('express');
const myuserController = require('../controllers/myUserController');
const {setFilter} = require('../controllers/handlerFactory');
const {protected} = require('../utils/middleware/protected');
const router = express.Router();

router.get('/' ,protected,setFilter, myuserController.getUserLoggedIn);
router.delete('/',protected, myuserController.deleteUser);
router.put('/',protected, myuserController.updateUser);

module.exports = router