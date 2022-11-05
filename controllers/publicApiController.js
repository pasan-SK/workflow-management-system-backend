const User = require("../model/User")

const confirmUser = async (req, res) => {
    const id = req.params.id;
    const user = await User.findById(id);

    if(!user) {
        return res.status(400).json({"message":"Something went wrong"});
    }

    if(user.confirmation===1) {
        return res.status(208).json({"message":"Already Confirmed User"}); 
    }

    user.confirmation = 1;
    const result = await user.save();
    
    return res.status(200).json({"message":result.confirmation});
}

module.exports = {
    confirmUser
}