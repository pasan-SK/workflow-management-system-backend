const express = require('express');
const router = express.Router();
const notificationController = require('../../controllers/notificationController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
    .get(notificationController.getAllNotifications)
    .post(notificationController.createNewNotifications)
    .put(notificationController.updateNotification)
    .delete(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.DI), notificationController.deleteNotification);

router.route('/:count')
    .get(notificationController.getLimitedNotifications);
module.exports = router;