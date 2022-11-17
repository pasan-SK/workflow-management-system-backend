const User = require("../model/User")
const bcryptjs = require('bcryptjs');
const { logEvents } = require("../middleware/logEvents")

const getAllUsers = async (req, res) => {
    const result = await User.find({})
    if (!result) res.status(204).json({ "message": "No categories found" }) //no content
    if (result.length === 0) res.status(204).json({ "message": "No categories found" }) //no content

    else res.status(200).json(result);
}

const createNewUser = async (req, res) => {
    //request body should contain the email, pwd, roles of the new user
    /*Note: Roles should be an object
    ex: roles: {
        "Admin": 2000,
        "DI": 2001
    }
    */
    if (!req?.body?.pwd || !req?.body?.email || !req?.body?.roles) {
        return res.status(400).json({ 'message': 'email, password and roles of the new user are required.' }); //bad request
    }

    const email = req.body.email
    const roles = req.body.roles

    const hashedPwd = bcryptjs.hashSync(req.body.pwd, 10);
    const result = await User.create({
        "email": email,
        "password": hashedPwd,
        "roles": roles
    })
    logEvents(`USER CREATION\t${req.email}\t${result._id}`, 'usersLog.txt')
    res.status(201).json(result); //created
}

const updateUser = async (req, res) => {
    //request body should contain the id and the new other fields of the user that should be updated
    if (!req?.body?.id) {
        return res.status(400).json({ 'message': 'User id is required.' }); //bad request
    }
    const id = req.body.id
    const user = await User.findById(id).exec()
    if (!user) {
        return res.status(400).json({ "message": `User with id = ${id} is not found` }); //bad request
    }

    if (req.body.firstname) user.firstname = req.body.firstname;
    if (req.body.lastname) user.lastname = req.body.lastname;
    if (req.body.email) {
        const email = req.body.email
        const duplicate = await User.find({ email })
        if (duplicate.length === 0) {
            user.email = req.body.email;
        } else {
            //conflict - duplicate emails
            return res.status(409).json({ 'message': `The email: ${email} is already in the system` })
        }
    }
    if (req.body.pwd) {
        const hashedPwd = bcryptjs.hashSync(req.body.pwd, 10);
        if (!hashedPwd) return res.status(500).json({"message": "user could not be updated"})
        user.password = hashedPwd;
    }
    if (req.body.status) user.status = req.body.status

    const result = await user.save()
    logEvents(`USER UPDATE\t${req.email}\t${id}`, 'usersLog.txt')
    res.status(200).json(result); //updated successfully
}

const deleteUser = async (req, res) => {
    //request body should contain the id of the category that should be deleted
    if (!req?.body?.id) {
        return res.status(400).json({ 'message': 'User id is required.' }); //bad request
    }
    const id = req.body.id
    const user = await User.findById(id)

    if (!user) {
        return res.status(400).json({ "message": `User with ID ${req.body.id} not found` }); //bad request
    }
    const result = await User.deleteOne({ _id: id })
    logEvents(`USER DELETE\t${req.email}\t${id}`, 'usersLog.txt')
    res.status(200).json(result);
}

const getUser = async (req, res) => {
    const id = req.params.id
    const user = await User.findById(id)

    if (!user) {
        return res.status(400).json({ "message": `User ID with ${req.body.id} not found` });  //bad request
    }
    res.status(200).json(user);
}

const changeStatus = async (req, res) => {
    //request body should contain the new userStatus
    if (!req.body.newUserStatus) {
        return res.status(400).json({ 'message': 'new user status is required.' }); //bad request
    }
    const newUserStatus = req.body.newUserStatus
    const id = req.params.id
    const user = await User.findById(id).exec()
    if (!user) {
        return res.status(400).json({ "message": `User with id = ${id} is not found` }); //bad request
    }

    const currentStatus = user.userStatus
    
    if (currentStatus === newUserStatus) {
        return res.status(200).json({"message": "No status change is required"})
    }

    user.userStatus = newUserStatus
    const result = await user.save()
    logEvents(`USER STATUS CHANGE\t${req.email}\t${id}\t${newUserStatus}`, 'usersLog.txt')
    res.status(200).json(result); //updated successfully
}

const changeRoles = async (req, res) => {
    //request body should contain the new roles list
    if (!req.body.newRolesList) {
        return res.status(400).json({ 'message': 'new user roles list is required.' }); //bad request
    }
    const newRolesList = req.body.newRolesList
    const id = req.params.id
    const user = await User.findById(id).exec()
    if (!user) {
        return res.status(400).json({ "message": `User with id = ${id} is not found` }); //bad request
    }

    const currentRolesList = user.userRoles
    
    if (currentRolesList === newRolesList) {
        return res.status(200).json({"message": "No roles change is required"})
    }

    user.roles = newRolesList
    const result = await user.save()
    logEvents(`USER ROLES CHANGE\t${req.email}\t${id}\t${newRolesList}`, 'usersLog.txt')
    res.status(200).json(result); //updated successfully
}

const changePassword = async (req, res) => {
    const id = req.params.id;
    const user = await User.findById(id);
    const {oldpwd, newpwd} = req.body;

    if(!user) {
        return res.status(400).json({"message":"Something went wrong"});
    }

    const match = bcryptjs.compareSync(oldpwd, user.password)

    if(match) {
        const hashedPwd = bcryptjs.hashSync(newpwd, 10);
        user.password = hashedPwd;
        const result = await user.save();
        res.status(200).json(result);
    }else {
        res.sendStatus(406); //wrong old password
    }
}

const getTotal = async (req, res) => {
    const count = await User.count({});
    res.status(200).json({ total: count });
}

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser,
    getUser,
    changeStatus,
    changeRoles,
    changePassword,
    getTotal
}