const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/categoryController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
    .get(categoryController.getAllCategories)
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.DI), categoryController.createNewCategory)
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.DI), categoryController.updateCategory)
    .delete(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.DI), categoryController.deleteCategory);

router.route('/:id')
    .get(categoryController.getCategory);

module.exports = router;