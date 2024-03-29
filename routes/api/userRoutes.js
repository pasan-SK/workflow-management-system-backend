const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
    .get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.DI), userController.getAllUsers)
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.DI), userController.createNewUser)
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.DI), userController.updateUser)
    .delete(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.DI), userController.deleteUser);

router.route('/total')
    .get(userController.getTotal);

router.route('/:id')
    .get(userController.getUser);

router.route('/password/:id')
    .patch(userController.changePassword);
    
router.route('/changeStatus/:id')
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.DI), userController.changeStatus);

router.route('/changeRoles/:id')
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.DI), userController.changeRoles);

module.exports = router;