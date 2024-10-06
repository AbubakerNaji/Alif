    
const express = require('express');
const serviceTypeController = require('../../controllers/servicesControllers/serviceTypeController');
const {setFilter} = require('../../controllers/handlerFactory');
const {protected,isAdmin} = require('../../utils/middleware/protected');
const upload = require('../../controllers/multiController');
const router = express.Router();

router.get('/' ,setFilter, serviceTypeController.getServiceType);

router.get('/:id', serviceTypeController.getOneServiceType);
router.post('/',protected,isAdmin,upload.single('image'), serviceTypeController.createServiceType);
router.put('/:id',protected,isAdmin, upload.single('image'),serviceTypeController.updateServiceType);
router.delete('/:id',protected,isAdmin, serviceTypeController.deleteServiceType);
module.exports = router