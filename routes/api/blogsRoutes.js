const express = require('express');
const router = express.Router();
const blogController = require('../../controllers/blogController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
    .get(blogController.getAllBlogs)
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), blogController.createNewBlog)
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), blogController.updateBlog)
    .delete(verifyRoles(ROLES_LIST.Admin), blogController.deleteBlog);

router.route('/:id')
    .get(blogController.getBlog);

module.exports = router;