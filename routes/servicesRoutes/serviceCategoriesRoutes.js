    
const express = require('express');
const serviceCategoriesController = require('../../controllers/servicesControllers/serviceCategoriesController');
const {setFilter} = require('../../controllers/handlerFactory');
const {protected, isAdmin} = require('../../utils/middleware/protected');
const router = express.Router();

router.get('/' ,setFilter, serviceCategoriesController.getServiceCategories);
router.get('/:id' , serviceCategoriesController.getOneServiceCategories);
router.post('/',protected,isAdmin, serviceCategoriesController.createServiceCategories);
router.delete('/:id',protected,isAdmin, serviceCategoriesController.deleteServiceCategories);
router.put('/:id',protected,isAdmin, serviceCategoriesController.updateServiceCategories);  

module.exports = router
