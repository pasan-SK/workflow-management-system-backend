'use strict';
const SingleFile = require('../../model/singlefile');
const MultipleFile = require('../../model/multiplefile');
const cloudinary = require("../../helpers/cloudinary");

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
                const result = await cloudinary.uploader.upload(element.path,  { resource_type: "raw" });
                // console.log(result)
                const file = {
                    fileName: element.originalname,
                    filePath: element.path,
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

module.exports = {
    singleFileUpload,
    multipleFileUpload,
    getallSingleFiles,
    getallMultipleFiles
}