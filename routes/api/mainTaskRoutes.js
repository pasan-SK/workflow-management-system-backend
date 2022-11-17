const express = require('express');
const router = express.Router();
const mainTaskController = require('../../controllers/mainTaskController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
    .get(mainTaskController.getAllMainTasks)
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.DI), mainTaskController.createNewMainTask)
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.DI), mainTaskController.updateMainTask)
    .delete(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.DI), mainTaskController.deleteMainTask);

router.route('/:id')
    .get(mainTaskController.getMainTask);

module.exports = router;