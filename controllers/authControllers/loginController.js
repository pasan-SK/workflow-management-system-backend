const User = require('../../model/User')
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
    const { email, pwd } = req.body;
    if (!email || !pwd) return res.status(400).json({ 'message': 'Email and password are required.' });
    
    const foundUser = await User.findOne({ email }).exec();
    if (!foundUser) return res.sendStatus(401); //Unauthorized 

    console.log("AAAAAAAA", bcryptjs.hashSync("c@c.com", 10), bcryptjs.compareSync(pwd, foundUser.password))

    // evaluate password 
    const match = bcryptjs.compareSync(pwd, foundUser.password);
    if (match) {
        const roles = Object.values(foundUser.roles).filter(Boolean);

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
        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });
        res.json({roles, accessToken });
    } else {
        res.sendStatus(401); //unauthorized (wrong password)
    }
}

module.exports = { handleLogin };
