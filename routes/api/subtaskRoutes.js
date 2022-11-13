const express = require('express');
const router = express.Router();
const subtaskController = require('../../controllers/subtaskController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
    .get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.DI), subtaskController.getAllSubtasks)
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.DI), subtaskController.createNewSubtask)
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.DI), subtaskController.updateSubtask)
    .delete(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.DI), subtaskController.deleteSubtask);

router.route('/:id')
    .get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.DI,ROLES_LIST.DI,ROLES_LIST.EA), subtaskController.getSubtask)
    .put(
        verifyRoles(ROLES_LIST.Admin, ROLES_LIST.DI,ROLES_LIST.EA),
        subtaskController.acceptSubtask
    );
router.route('/acceptance/:id').get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.DI,ROLES_LIST.DI,ROLES_LIST.EA), subtaskController.checkingAcceptance)

router.route('/of-maintask/:id')
    .get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.DI), subtaskController.getAllSubtasksOfMaintask)

module.exports = router;