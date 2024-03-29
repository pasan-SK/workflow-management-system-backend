'use strict';
const express = require('express');
const {upload} = require('../../helpers/filehelper');
const router = express.Router();
const {singleFileUpload, multipleFileUpload,
    getallSingleFiles, getallMultipleFiles, acceptanceChanger,comChanger,commentMailer} = require('../../controllers/fileUploadControllers/fileuploaderController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');








router.route('/')
    .get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.DI,ROLES_LIST.DI,ROLES_LIST.EA), getallSingleFiles)
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.DI,ROLES_LIST.DI,ROLES_LIST.EA),upload.single('file'),singleFileUpload)
router.route('/multiple')
    .post(verifyRoles(ROLES_LIST.DI, ROLES_LIST.Admin, ROLES_LIST.CE, ROLES_LIST.DI, ROLES_LIST.DIE, ROLES_LIST.DmanDI, ROLES_LIST.DmanDIE, ROLES_LIST.EA, ROLES_LIST.IE, ROLES_LIST.ME),upload.array('files'),multipleFileUpload) 

router.route('/multiple/:id')
    .get(verifyRoles(ROLES_LIST.DI, ROLES_LIST.Admin, ROLES_LIST.CE, ROLES_LIST.DI, ROLES_LIST.DIE, ROLES_LIST.DmanDI, ROLES_LIST.DmanDIE, ROLES_LIST.EA, ROLES_LIST.IE, ROLES_LIST.ME), getallMultipleFiles)

 router.route('/stateA')
    .put(verifyRoles(ROLES_LIST.DI, ROLES_LIST.Admin, ROLES_LIST.CE, ROLES_LIST.DI, ROLES_LIST.DIE, ROLES_LIST.DmanDI, ROLES_LIST.DmanDIE, ROLES_LIST.EA, ROLES_LIST.IE, ROLES_LIST.ME),acceptanceChanger)
// router.route('/stateC')
//     .put(verifyRoles(ROLES_LIST.DI, ROLES_LIST.Admin, ROLES_LIST.CE, ROLES_LIST.DI, ROLES_LIST.DIE, ROLES_LIST.DmanDI, ROLES_LIST.DmanDIE, ROLES_LIST.EA, ROLES_LIST.IE, ROLES_LIST.ME),comChanger);
router.route('/commentMail')
.post(verifyRoles(ROLES_LIST.DI, ROLES_LIST.Admin, ROLES_LIST.CE, ROLES_LIST.DI, ROLES_LIST.DIE, ROLES_LIST.DmanDI, ROLES_LIST.DmanDIE, ROLES_LIST.IE, ROLES_LIST.ME),commentMailer)
module.exports = router;