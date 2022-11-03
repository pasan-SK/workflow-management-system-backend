const User = require('../../model/User');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ROLES_LIST = require('../../config/roles_list')
const nodemailer = require('../../config/nodemailer.config');
const emailValidator = require('../../middleware/emailValidator');

const handleNewUser = async (req, res) => {
    let { email, pwd, firstname, lastname } = req.body;
    if (!email || !pwd || !firstname) return res.status(400).json({ 'message': 'Email, password and firstname are required.' });
    if (!lastname) lastname = "";

    // check for duplicate email in the db
    const duplicate = await User.findOne({email: email}).exec();
    if (duplicate) return res.sendStatus(409); //Conflict 
    try {
        const hashedPwd = bcryptjs.hashSync(pwd, 10);

        //create and store the new user
        /* NOTE: At the registration user roles are not specified. 
        *  Only admin/Di can specify the user role through his interface later 
        */
        const {valid, reason, validator} = await emailValidator.isValidEmail(email);
        // const valid = true;

        if(valid){
            // a valid email address
            User.create({
                "firstname": firstname,
                "lastname": lastname,
                "email": email,
                "password": hashedPwd
            }).then(document=>{
                nodemailer.sendConfirmationEmail(
                    firstname+" "+lastname, 
                    email, 
                    document._id
                ).then(result => {
                    if(result){
                        res.status(201).json({'id':document._id});
                    }else{
                        User.deleteOne({ _id: document._id }).then(del=>{
                            if(del.deletedCount===1){
                                res.status(503).json({'message':'Mail service not available. Try again later'});
                            }else {
                                res.status(508).json({'message':'Multiple Users created and deleted'});
                            }
                        });
                    }
                })
            });

        }else{
            res.status(406).json({'message':'Not Acceptable Email'});
        }
               
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

module.exports = { handleNewUser };