    
const express = require('express');
const serviceDateController = require('../../controllers/servicesControllers/serviceDateController');
const {setFilter} = require('../../controllers/handlerFactory');
const {protected,isAdmin} = require('../../utils/middleware/protected');
const upload = require('../../controllers/multiController');
const router = express.Router();

router.get('/' ,setFilter, serviceDateController.getServiceDate);
router.get('/:id', serviceDateController.getOneServiceDate);

router.post('/',protected,isAdmin, serviceDateController.createServiceDate);
router.put('/:id',protected,isAdmin,serviceDateController.updateServiceDate);
router.delete('/:id',protected,isAdmin, serviceDateController.deleteServiceDate);

module.exports = router