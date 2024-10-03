
const express = require('express');
const locationController = require('../controllers/locationController');
const {setFilter} = require('../controllers/handlerFactory');
const {protected} = require('../utils/middleware/protected');
const router = express.Router();

router.get('/' ,protected,setFilter, locationController.getMyLocations);
router.post('/',protected, locationController.AddLocation);
router.delete('/:id',protected, locationController.deleteLocation);
router.put('/:id',protected, locationController.updateLocation);

module.exports = router