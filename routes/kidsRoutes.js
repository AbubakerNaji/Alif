const express = require('express');
const kidController = require('../controllers/kidsController');
const {setFilter} = require('../controllers/handlerFactory');
//auth
const {protected} = require('../utils/middleware/protected');
const router = express.Router();

router.get('/' ,protected,setFilter, kidController.getMyKids);
router.post('/',protected, kidController.Addkid);
router.delete('/:id',protected, kidController.deletekid);
router.put('/:id',protected, kidController.updatekid);

module.exports = router