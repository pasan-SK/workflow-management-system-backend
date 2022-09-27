const Subtasks = require("../model/Subtasks")
const bcryptjs = require('bcryptjs');

let ObjectId = require('mongodb').ObjectId

const getAllSubtasks = async (req, res) => {
    const result = await Subtasks.find({})
    if (!result) res.status(204).json({ "message": "No mainTasks found" }) //no content
    if (result.length === 0) res.status(204).json({ "message": "No mainTasks found" }) //no content

    else res.status(200).json(result);
}

const createNewSubtask = async (req, res) => {
    //request body should contain the maintask_id, name, assigned_employees of the new maintask

    if (!req?.body?.maintask_id || !req?.body?.name || !req?.body?.assigned_employees || !req?.body?.note) {
        return res.status(400).json({ 'message': 'maintask_id, name, note and assigned_employees of the new subTask are required.' }); //bad request
    }

    const maintask_id = req.body.maintask_id
    const name = req.body.name
    const assigned_employees = req.body.assigned_employees
    const note = req.body.note

    let result;

    if (req?.body?.deadline) {
        result = await Subtasks.create({
            "maintask_id": maintask_id,
            "name": name,
            "assigned_employees": assigned_employees,
            "note": note,
            "createdAt": new Date(),
            "updatedAt": new Date(),
            "deadline": req.body.deadline
        })
    } else {
        result = await Subtasks.create({
            "maintask_id": maintask_id,
            "name": name,
            "note": note,
            "assigned_employees": assigned_employees,
            "createdAt": new Date(),
            "updatedAt": new Date()
        })
    }

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
    if (req.body.assigned_employees) subTask.assigned_employees = req.body.assigned_employees;
    if (req.body.deadline) subTask.deadline = req.body.deadline;
    if (req.body.note) subTask.note = req.body.note;

    subTask.updatedAt = new Date();

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

const getAllSubtasksOfMaintask = async (req, res) => {

    const id = req.params.id 
    const maintaskID = new ObjectId(id)
    const allSubtasks = await Subtasks.find({ "maintask_id":  maintaskID }).sort({ "_id": 1 })

    if (!allSubtasks) {
        return res.status(400).json({ "message": `Subtasks with maintasksID=${req.params.id} not found` });  //bad request
    }
    res.status(200).json(allSubtasks);
}

const acceptSubtask = async (req, res) => {
    console.log("hii");
    const s_id = req.params.id;
    console.log(s_id);
    const subTask = await Subtasks.findById(s_id);
    console.log(subTask);
  
    if (!subTask) {
      return res
        .status(400)
        .json({ message: `For Accepting: Subtasks ID with ${s_id} not found` });
    }
    console.log(subTask.assigned_employees);
    for (var [key, value] of subTask.assigned_employees.entries()) {
      console.log(key);
      const user = await User.findById(key);
      console.log(req.email);
      console.log(user.email);
      if (req.email === user.email) {
        subTask.assigned_employees.set(key, true);
      }
    }
  
    subTask.updatedAt = new Date();
    const result = await subTask.save();
    res.status(200).json(result); //updated successfully
  };
  
  module.exports = {
    getAllSubtasks,
    createNewSubtask,
    updateSubtask,
    deleteSubtask,
    getSubtask,
    getAllSubtasksOfMaintask,
    acceptSubtask,
  };