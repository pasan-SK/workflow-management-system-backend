const express = require('express');
const router = express.Router();
const refreshTokenController = require('../../controllers/authControllers/refreshTokenController');

router.get('/', refreshTokenController.handleRefreshToken);

module.exports = router;