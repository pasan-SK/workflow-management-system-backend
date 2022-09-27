const mongoose = require('mongoose'); 
const User = require("../model/User")
const Notification = require("../model/Notification")
const MainTask = require('../model/MainTask')
const Category = require('../model/Category')
const SubTasks = require('../model/Subtasks')

const NOTIFICATION_TYPE = require("../config/notification_type");

const getAllNotifications = async (req, res) => {

    if(!req?.email) {
        return res.status(401).json({
            "message":"Invalid Token"
        });
    }

    const user = await User.findOne({"email":req.email}).exec();

    if(!user || user.length == 0) {
        res.status(403).json({"message":"Not a registered user"});
    }

    const id = user._id;

    const readQuery = {[`receiver.${id}`]:true};
    const unreadQuery = {[`receiver.${id}`]:false};

    const allNotifications = await Notification.find({$or: [readQuery, unreadQuery]}).sort([['createdAt',-1]]).exec();   

    if(!allNotifications || allNotifications.length == 0) {
        // No Content
        return res.status(204).json();
    }

    return res.status(200).json({
        unread: allNotifications
    });
}

const getLimitedNotifications = async (req, res) => {
    if(!req?.email) {
        return res.status(401).json({
            "message":"Invalid Token"
        });
    }

    const user = await User.findOne({"email":req.email}).exec();

    if(!user || user.length == 0) {
        res.status(403).json({"message":"Not a registered user"});
    }

    const id = user._id;

    const count = Number(req.params.count);
    if(isNaN(count) || count<1) {
        return res.status(400).json({
            "message":"Invalid notification count requested"
        })
    }

    const readQuery = {[`receiver.${id}`]:true};
    const unreadQuery = {[`receiver.${id}`]:false};

    const allNotifications = await Notification.find({$or: [readQuery, unreadQuery]}).sort([['createdAt',-1]]).limit(count).exec();   

    if(!allNotifications || allNotifications.length == 0) {
        // No Content
        return res.status(204).json();
    }

    const result = allNotifications.map(( notification, index) => {
        return {...notification._doc, user_id:id}
    });

    return res.status(200).json({
        notifications: result
    });
}

const createNewNotifications = async (req, res) => {
    if((!req?.body?.type)||(!req?.body?.project_id)) {
        return res.status(400).json({
            "message":"Notification type and Project ID is required"
        });
    }

    if(!req?.email) {
        return res.status(401).json({
            "message":"Invalid Token"
        });
    }

    const user = await User.findOne({"email":req.email}).exec();

    if(!user || user.length == 0) {
        res.status(403).json({"message":"Not a registered user"});
    }

    const user_id = user._id;
    const type = req.body.type;
    const project_id = req.body.project_id;

    var hex = /^[0-9a-fA-F]{24}$/;
    if(!hex.test(project_id)) {
        return res.status(400).json({message:"Bad Object Id"});
    }

    if(!Object.keys(NOTIFICATION_TYPE).includes(type)) {
        return res.status.status(400).json({
            "message":"Only Specified Notification type is allowed"
        });
    }else {

        const description = NOTIFICATION_TYPE[type];
        const notifications = await MainTask.findById(project_id).populate('category_id').exec();
        
        if(!notifications) {
            return res.status(400).json({
                "message":`Project with project id ${project_id} does not exist`
            });
        }

        const category = notifications.category_id.name;
        const link = 'dashboard/products'
        
        // const subTasks = await SubTasks.find({maintask_id: ObjectId(project_id)}).exec();

        const subTasks = await SubTasks.find({"maintask_id":{"_id":project_id}}).populate('maintask_id').exec();

        const employees = [user_id];
        subTasks.forEach((value, index)=>{
            const iterator = value.assigned_employees.keys();
            for (let emp_id of iterator) {
                if(!employees.includes(emp_id)){
                    employees.push(emp_id);
                }   
            }
        });

        notification_list_employees = {}
        employees.forEach(employee => {
            notification_list_employees[employee] = false;
        });

        const result = await Notification.create({
            "mainTaskId":project_id,
            "project": category,
            "description": description,
            "link": link,
            "type": type,
            "receiver": notification_list_employees
        });

        return res.status(201).json({
            "message":"Notification Successfully Created"
        });
    }
}

const updateNotification = async (req, res) => {
    //request body should contain the id of the user and id of the notification that needs to be updated.

    if((!req?.body?.id)||(!req?.body?.noti_id)) {
        return res.status(404).json({
            "message":"User id(id) and notification id(noti_id) is required"
        });
    }

    const notification_id = req.body.noti_id;
    const user_id = req.body.id;

    const newUpdate = {[`receiver.${user_id}`]:true}

    var hex = /^[0-9a-fA-F]{24}$/;
    if(!hex.test(notification_id) || !hex.test(user_id)) {
        return res.status(400).json({message:"Bad Object Id"});
    }

    const result = await Notification.updateOne({ "_id": mongoose.Types.ObjectId(`${notification_id}`) }, { $set: newUpdate }).exec();

    return res.status(200).json(result);
}

const deleteNotification = async (req, res) => {
    //use this api to delete notifications when a project is deleted. id of the main task.

    if(!req?.body?.project_id) {
        return res.status(404).json({
            "message":"Project Id is required"
        });
    }

    const project_id = req.body.project_id;
    var hex = /^[0-9a-fA-F]{24}$/;
    if(!hex.test(project_id)) {
        return res.status(400).json({message:"Bad Object Id"});
    }

    const notifications = await Notification.find({"mainTaskId":mongoose.Types.ObjectId(`${project_id}`)}).exec();

    if(!notifications || notifications.length == 0) {
        return res.status(400).json({ "message": "This Main Task does not have any notification." }); //bad request
    }

    let success = true;
    for (let [key, value] of Object.entries(notifications)) {
        Notification.deleteOne({_id:value._id}).exec().then((resu) => {
            if(success == false) {
                return res.status(400).json({"message":"Bad Request"});
            }
            if(key== notifications.length -1) {
                return res.status(200).json({"message":"All relevant notifications have been deleted"})
            }
        }).catch((error) => {
            success = false;
            return res.status(400).json({"message":"Bad Request"})
        });
    }
}

module.exports = {
    getAllNotifications,
    createNewNotifications,
    getLimitedNotifications,
    updateNotification,
    deleteNotification
}