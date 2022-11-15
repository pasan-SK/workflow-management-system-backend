const express = require('express');
const router = express.Router();
const passwordResetController = require('../../controllers/authControllers/PasswordResetController');

router.route('/reset/user')
    .post(passwordResetController.userRequest);

router.route('/reset/email/:id')
    .get(passwordResetController.emailRequest);

    
module.exports = router;