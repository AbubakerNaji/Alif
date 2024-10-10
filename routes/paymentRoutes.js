
const express = require('express');
const paymentController = require('../controllers/paymentController');
const testPlutuAdfali = require("../controllers/plutu/testPlutuAdfaliController");

const {setFilter} = require('../controllers/handlerFactory');
const {protected} = require('../utils/middleware/protected');
const upload = require('../controllers/multiController');

const router = express.Router();
// check the wallet
router.get('/' ,protected,paymentController.setFilterWallet, paymentController.getMyPayments);
router.post('/deposit/verify', protected, paymentController.DepositEdfaliVerify,testPlutuAdfali.testPlutuAdfaliVerify);
router.post('/deposit/confirm', protected,/*testPlutuAdfali.testPlutuAdfaliConfirm,*/ paymentController.DepositEdfaliConfirm);

module.exports = router