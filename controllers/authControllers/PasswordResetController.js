const bcryptjs = require('bcryptjs');
const User = require('../../model/User')
const nodemailer = require('../../config/nodemailer.config');

const userRequest = async (req, res) => {
    const { email, firstname } = req.body;

    const generatePassword  = ()=>{
        var password = Date.now()
        password = "GiD@"+password;
        return password;
    }

    const user = await User.findOne({email:email, firstname:firstname}).exec();

    if(user){
        const name = user.firstname+' '+user?.lastname;
        const newPassword = generatePassword();
        user.tempPassword = newPassword;

        const response1 = await user.save();
        
        if (response1) {
            const id = user._id;

            nodemailer.sendPasswordResetMail(name, email, newPassword, id).then((tempres1)=>{
                res.status(200).json({'message':'Email sent'})
            }).catch((err)=>{
                res.status(503).json({'message':"Email server failed. Try again"});
            })
        }else{
            res.status(500).json({'message':'Server failed. resend the request'})
        }

    }else{
        res.statis(404).json({'message':"Invalid user details"});
    }
}

const emailRequest = async (req, res) =>{
    // console.log(req.params.pass);
    const user_id = req.params.id;
    const user = await User.findById(user_id);

    if (user){
        const newPassword = user?.tempPassword;
        if(newPassword){
            const hashPass = bcryptjs.hashSync(newPassword, 10)
            const sentTime = newPassword.split('@')[1];
            const currentTime = Date.now();

            if(currentTime-600000 < sentTime){
                user.password = hashPass;
                user.tempPassword = '';
                const response1 = await user.save();
                console.log(user.password);
                if(response1){
                    return res.status(205).json({'message':"Password successfully resetted"});
                }else{
                    return res.status(500).json({'message':'Server error. Try again in a while.'});
                }

            }else{
                return res.status(412).json({'message':"Link expired"})
            }
        }else{
            return res.status(400).json({"message":"New Password not found on the server. Try resetting the password from the begining."})
        }

    }else{
        return res.status(400).json({"message":"Invalid link, user not found"});
    }
}

module.exports = { userRequest, emailRequest };
