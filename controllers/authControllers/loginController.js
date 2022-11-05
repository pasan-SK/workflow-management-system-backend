const User = require('../../model/User')
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
    console.log("Logged");
    const { email, pwd } = req.body;
    if (!email || !pwd) return res.status(400).json({ 'message': 'Email and password are required.' });
    
    const foundUser = await User.findOne({ email }).exec();
    if (!foundUser) return res.sendStatus(401); //Unauthorized 

    // evaluate password 
    const match = bcryptjs.compareSync(pwd, foundUser.password);
    if (match) {
        
        // The `.filter(Boolean)` just removes values from a list which are "falsey", like empty strings or null.
        // For eg: it converts{ Admin: 200, DI: 2001 } to [2000, 2001]
        const roles = Object.values(foundUser.roles).filter(Boolean);
        const firstname = foundUser.firstname;
        const id = foundUser.id;
        // create JWTs
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "email": foundUser.email,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '3000s' }
        );
        const refreshToken = jwt.sign(
            { "email": foundUser.email },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        // Saving refreshToken with current user
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();    

        //********************SECURE*********************** */
        /** secure=false if using thunderclient or postman
         *  secure=true when connecting backend with the UIs (in web app)
         */
        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: false, maxAge: 24 * 60 * 60 * 1000 });
        res.json({firstname, id, roles, accessToken });
    } else {
        res.sendStatus(401); //unauthorized (wrong password)
    }
}

module.exports = { handleLogin };
