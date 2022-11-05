const express = require('express');
const router = express.Router();
const publicApiController = require('../../controllers/publicApiController');

router.route('/email/confirm/:id')
    .get(publicApiController.confirmUser);
    
module.exports = router;