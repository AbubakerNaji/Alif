
const express = require('express');
const companyInfoController = require('../controllers/CompanyInfoController');
const {setFilter} = require('../controllers/handlerFactory');
const {protected, isAdmin} = require('../utils/middleware/protected');
const upload = require('../controllers/multiController');

const router = express.Router();    

router.get('/' ,setFilter, companyInfoController.selectCompanyInfo);
router.post('/',protected,isAdmin,upload.single('image'), companyInfoController.createCompanyInfo);    
router.put('/:id',protected,isAdmin,upload.single('image'), companyInfoController.updateCompanyInfo);
router.delete('/:id',protected,isAdmin, companyInfoController.deleteCompanyInfo);

module.exports = router