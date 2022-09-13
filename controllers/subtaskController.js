const Subtasks = require("../model/Subtasks")
const bcryptjs = require('bcryptjs');

const getAllSubtasks = async (req, res) => {
    const result = await Subtasks.find({})
    if (!result) res.status(204).json({ "message": "No mainTasks found" }) //no content
    if (result.length === 0) res.status(204).json({ "message": "No mainTasks found" }) //no content

    else res.status(200).json(result);
}

const createNewSubtask = async (req, res) => {
    //request body should contain the maintask_id, name, assigned_employee_IDs of the new maintask

    if (!req?.body?.maintask_id || !req?.body?.name || !req?.body?.assigned_employee_IDs) {
        return res.status(400).json({ 'message': 'maintask_id, name and assigned_employee_IDs of the new subTask are required.' }); //bad request
    }

    const maintask_id = req.body.maintask_id
    const name = req.body.name
    const assigned_employee_IDs = req.body.assigned_employee_IDs

    const result = await Subtasks.create({
        "maintask_id": maintask_id,
        "name": name,
        "assigned_employee_IDs": assigned_employee_IDs
    })

    res.status(201).json(result); //created
}

const updateSubtask = async (req, res) => {
    //request body should contain the id and the new other fields of the subTask that should be updated
    if (!req?.body?.id) {
        return res.status(400).json({ 'message': 'Subtasks id is required.' }); //bad request
    }
    const id = req.body.id
    const subTask = await Subtasks.findById(id).exec()
    if (!subTask) {
        return res.status(400).json({ "message": `Subtasks with id = ${id} is not found` }); //bad request
    }

    if (req.body.maintask_id) subTask.maintask_id = req.body.maintask_id;
    if (req.body.name) subTask.name = req.body.name;
    if (req.body.assigned_employee_IDs) subTask.assigned_employee_IDs = req.body.assigned_employee_IDs;

    const result = await subTask.save()
    res.status(200).json(result); //updated successfully
}

const deleteSubtask = async (req, res) => {
    //request body should contain the id of the subTask that should be deleted
    if (!req?.body?.id) {
        return res.status(400).json({ 'message': 'Subtasks id is required.' }); //bad request
    }
    const id = req.body.id
    const subTask = await Subtasks.findById(id)

    if (!subTask) {
        return res.status(400).json({ "message": `Subtasks with ID ${req.body.id} not found` }); //bad request
    }
    const result = await Subtasks.deleteOne({ _id: id })
    res.status(200).json(result);
}

const getSubtask = async (req, res) => {
    //request body should contain the id of the subTask that should be fetched
    const id = req.body.id
    const subTask = await Subtasks.findById(id)

    if (!subTask) {
        return res.status(400).json({ "message": `Subtasks ID with ${req.body.id} not found` });  //bad request
    }
    res.status(200).json(subTask);
}

module.exports = {
    getAllSubtasks,
    createNewSubtask,
    updateSubtask,
    deleteSubtask,
    getSubtask
}