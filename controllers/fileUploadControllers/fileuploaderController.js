'use strict';
const SingleFile = require('../../model/singlefile');
const MultipleFile = require('../../model/multiplefile');
const cloudinary = require("../../helpers/cloudinary");
const multiplefile = require('../../model/multiplefile');

const singleFileUpload = async (req, res, next) => {
    try{
         // Upload file to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path,  { resource_type: "raw" });
        const file = new SingleFile({
            fileName: req.file.originalname,
            filePath: req.file.path,
            fileType: req.file.mimetype,
            fileSize: fileSizeFormatter(req.file.size, 2), // 0.00
            fileURL:result.url,
            cloudinary_id: result.public_id,
        });
        console.log(result);
        await file.save();
        res.status(201).send('File Uploaded Successfully');
    }catch(error) {
        console.log(error);
        res.status(400).send(error.message);
    }
}
const multipleFileUpload = async (req, res, next) => {
    try{
        
        const filesArray = [];
            for (const element of req.files){
                const result = await cloudinary.uploader.upload(element.path, { use_filename: true, 
                    unique_filename: false, resource_type: "raw" });
                // console.log(result)
                const file = {
                    fileName: element.originalname,
                    acceptance:false,
                    // if Accept the task change the value for true
                    filePath: element.path,
                    comment:false,
                    //if commented change the value for true
                    fileType: element.mimetype,
                    fileSize: fileSizeFormatter(element.size, 2),
                    fileURL: result.url,
                    cloudinary_id: result.public_id,
                }
                filesArray.push(file);
            }
        console.log(filesArray);
        const multipleFiles = new MultipleFile({
            title: req.body.title,
            subtask_id:req.body.subtask_id,
            userID:req.body.userID,
            author:req.body.author,
            email:req.body.email,
            roles:req.body.roles,
            files: filesArray 
        });
        await multipleFiles.save();
        res.status(201).send('Files Uploaded Successfully');
    }catch(error) {
        console.log(error);
        res.status(400).send(error.message);
    }
}

const getallSingleFiles = async (req, res, next) => {
    try{
        const files = await SingleFile.find();
        res.status(200).send(files);
    }catch(error) {
        res.status(400).send(error.message);
    }
}
const getallMultipleFiles = async (req, res, next) => {
    try{
        const files = await MultipleFile.find();
        res.status(200).send(files);
    }catch(error) {
        res.status(400).send(error.message);
    }
}

const fileSizeFormatter = (bytes, decimal) => {
    if(bytes === 0){
        return '0 Bytes';
    }
    const dm = decimal || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'YB', 'ZB'];
    const index = Math.floor(Math.log(bytes) / Math.log(1000));
    return parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) + ' ' + sizes[index];

}
const acceptanceChanger= async(req,res) =>{
    const id = req.body.ftID;
    console.log(id);
    const clID=req.body.cloudId;
    const fileTurn = await multiplefile.findById(id).exec();
    const f=fileTurn.files;
    if (!fileTurn) {
        return res.status(400).json({ "message": `file stock with id = ${id} is not found` }); //bad request
    }
    for (var i of f) {
        // console.log(i.fileName);
            if(i.fileURL===clID){
                console.log("yes");
                i.acceptance=!(i.acceptance);

                fileTurn.updatedAt = new Date();
                fileTurn.files=f;
                const result = await fileTurn.save();
                res.status(200).json(result); //updated successfully
        
            }
        
        // if(i.fileURL===clID){
        //   
        // }

    }

    
    
}
const comChanger= async(req,res) =>{
    const id = req.body.ftID;
    console.log(id);
    const clID=req.body.cloudId;
    const fileTurn = await multiplefile.findById(id).exec();
    console.log(fileTurn.files);
    if (!fileTurn) {
        return res.status(400).json({ "message": `file stock with id = ${id} is not found` }); //bad request
    }
    for (var i of fileTurn.files) {
        // console.log(i.fileName);
            if(i.fileURL===clID){
                console.log("yes");
                i.comment=!(i.comment);
                fileTurn.updatedAt = new Date();
                const result = await fileTurn.save();
                res.status(200).json(result); //updated successfully
        
            }
        
        // if(i.fileURL===clID){
        //   
        // }

    }

    
    
}
module.exports = {
    singleFileUpload,
    multipleFileUpload,
    getallSingleFiles,
    getallMultipleFiles,
    acceptanceChanger,
    comChanger
}