const MainTask = require("../model/MainTask")
const bcryptjs = require('bcryptjs');

const getAllMainTasks = async (req, res) => {
    const result = await MainTask.find({}).sort({_id: -1})
    if (!result) res.status(204).json({ "message": "No mainTasks found" }) //no content
    if (result.length === 0) res.status(204).json({ "message": "No mainTasks found" }) //no content

    else res.status(200).json(result);
}

const createNewMainTask = async (req, res) => {
    //request body should contain the category_id, description, subtasks_ids of the new maintask

    if (!req?.body?.category_id || !req?.body?.description) {
        console.log("RRRRRRRRRRRRR ", req.body)
        return res.status(400).json({ 'message': 'category_id, description and subtasks_ids of the new mainTask are required.' }); //bad request
    }

    const category_id = req.body.category_id
    const description = req.body.description
    // const subtasks_ids = req.body.subtasks_ids

    let result;

    if (req?.body?.budget) {
        result = await MainTask.create({
            "category_id": category_id,
            "description": description,
            // "subtasks_ids": subtasks_ids,
            "createdAt": new Date(),
            "updatedAt": new Date(),
            "budget": req.body.budget
        })
    } else {
        result = await MainTask.create({
            "category_id": category_id,
            "description": description,
            // "subtasks_ids": subtasks_ids,
            "createdAt": new Date(),
            "updatedAt": new Date()
        })
    }

    res.status(201).json(result); //created
}

const updateMainTask = async (req, res) => {
    //request body should contain the id and the new other fields of the mainTask that should be updated
    if (!req?.body?.id) {
        return res.status(400).json({ 'message': 'MainTask id is required.' }); //bad request
    }
    const id = req.body.id
    const mainTask = await MainTask.findById(id).exec()
    if (!mainTask) {
        return res.status(400).json({ "message": `MainTask with id = ${id} is not found` }); //bad request
    }

    if (req.body.category_id) mainTask.category_id = req.body.category_id;
    if (req.body.description) mainTask.description = req.body.description;
    // if (req.body.subtasks_ids) mainTask.subtasks_ids = req.body.subtasks_ids;
    if (req.body.budget) mainTask.budget = req.body.budget;
    mainTask.updatedAt = new Date();

    const result = await mainTask.save()
    res.status(200).json(result); //updated successfully
}

const deleteMainTask = async (req, res) => {
    //request body should contain the id of the mainTask that should be deleted
    if (!req?.body?.id) {
        return res.status(400).json({ 'message': 'MainTask id is required.' }); //bad request
    }
    const id = req.body.id
    const mainTask = await MainTask.findById(id)

    if (!mainTask) {
        return res.status(400).json({ "message": `MainTask with ID ${req.body.id} not found` }); //bad request
    }
    const result = await MainTask.deleteOne({ _id: id })
    res.status(200).json(result);
}

const getMainTask = async (req, res) => {
    const id = req.params.id 
    const mainTask = await MainTask.findById(id)

    if (!mainTask) {
        return res.status(400).json({ "message": `MainTask with ID=${req.body.id} not found` });  //bad request
    }
    res.status(200).json(mainTask);
}

module.exports = {
    getAllMainTasks,
    createNewMainTask,
    updateMainTask,
    deleteMainTask,
    getMainTask,
}