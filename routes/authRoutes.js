const express = require('express');
const authController = require('../controllers/authController');
const upload = require('../controllers/multiController');

const router = express.Router();

router.post('/signup',upload.single('image'), authController.signup);
router.post('/login', authController.login);

module.exports = router