
const express = require('express');
const passController = require('../controllers/passController');
const {setFilter} = require('../controllers/handlerFactory');
const {protected} = require('../utils/middleware/protected');
const router = express.Router();

router.get('/' ,protected,setFilter, passController.getPasses);
router.post('/',protected, passController.AddPass);
router.delete('/:id',protected, passController.deletePass);
router.patch('/:id',protected, passController.updatePass);

module.exports = router