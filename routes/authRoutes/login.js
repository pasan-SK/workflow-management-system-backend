const express = require('express');
const router = express.Router();
const authController = require('../../controllers/authControllers/loginController');

router.post('/', authController.handleLogin);

module.exports = router;