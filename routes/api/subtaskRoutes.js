const express = require('express');
const router = express.Router();
const subtaskController = require('../../controllers/subtaskController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
    .get(subtaskController.getAllSubtasks)
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.DI), subtaskController.createNewSubtask)
    .put(subtaskController.updateSubtask)
    .delete(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.DI), subtaskController.deleteSubtask);

router.route('/completedTotal')
    .get(subtaskController.getCompletedTotal)

router.route('/pendingTotal')
    .get(subtaskController.getPendingTotal)

router.route('/:id')
    .get(verifyRoles(ROLES_LIST.DI, ROLES_LIST.Admin, ROLES_LIST.CE, ROLES_LIST.DI, ROLES_LIST.DIE, ROLES_LIST.DmanDI, ROLES_LIST.DmanDIE, ROLES_LIST.EA, ROLES_LIST.IE, ROLES_LIST.ME), subtaskController.getSubtask)
    .put(
        verifyRoles(ROLES_LIST.DI, ROLES_LIST.Admin, ROLES_LIST.CE, ROLES_LIST.DI, ROLES_LIST.DIE, ROLES_LIST.DmanDI, ROLES_LIST.DmanDIE, ROLES_LIST.EA, ROLES_LIST.IE, ROLES_LIST.ME),
        subtaskController.acceptSubtask
    );
router.route('/acceptance/:id').get(verifyRoles(ROLES_LIST.DI, ROLES_LIST.Admin, ROLES_LIST.CE, ROLES_LIST.DI, ROLES_LIST.DIE, ROLES_LIST.DmanDI, ROLES_LIST.DmanDIE, ROLES_LIST.EA, ROLES_LIST.IE, ROLES_LIST.ME), subtaskController.checkingAcceptance)

router.route('/of-maintask/:id')
    .get(subtaskController.getAllSubtasksOfMaintask)
router.route('/getDetailed/:id')
.get(verifyRoles(ROLES_LIST.DI, ROLES_LIST.Admin, ROLES_LIST.CE, ROLES_LIST.DI, ROLES_LIST.DIE, ROLES_LIST.DmanDI, ROLES_LIST.DmanDIE, ROLES_LIST.EA, ROLES_LIST.IE, ROLES_LIST.ME), subtaskController.getSubtaskD);

module.exports = router;