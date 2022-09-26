const User = require('../../model/User');
const bcryptjs = require('bcryptjs');

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
        const result = await User.create({
            "firstname": firstname,
            "lastname": lastname,
            "email": email,
            "password": hashedPwd
        });
        // console.log(result);
        
        res.status(201).json({ 'id': result._id });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

module.exports = { handleNewUser };