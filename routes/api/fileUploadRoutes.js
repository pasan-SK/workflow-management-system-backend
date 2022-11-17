'use strict';
const express = require('express');
const {upload} = require('../../helpers/filehelper');
const router = express.Router();
const {singleFileUpload, multipleFileUpload,
    getallSingleFiles, getallMultipleFiles} = require('../../controllers/fileUploadControllers/fileuploaderController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');







router.route('/')
    .get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.DI,ROLES_LIST.DI,ROLES_LIST.EA), getallSingleFiles)
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.DI,ROLES_LIST.DI,ROLES_LIST.EA),upload.single('file'),singleFileUpload)
router.route('/multiple')
    .get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.DI,ROLES_LIST.DI,ROLES_LIST.EA), getallMultipleFiles)
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.DI,ROLES_LIST.DI,ROLES_LIST.EA),upload.array('files'),multipleFileUpload)  

module.exports = router;