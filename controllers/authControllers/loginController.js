const User = require('../../model/User')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
    const { email, pwd } = req.body;
    if (!email || !pwd) return res.status(400).json({ 'message': 'Email and password are required.' });
    
    const foundUser = await User.findOne({ email }).exec();
    if (!foundUser) return res.sendStatus(401); //Unauthorized 

    // evaluate password 
    const match = await bcrypt.compare(pwd, foundUser.password);
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
            { expiresIn: '300s' }
        );
        const refreshToken = jwt.sign(
            { "email": foundUser.email },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        // Saving refreshToken with current user
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();
        // console.log(result);
        
        //the secure property takes a boolean (true/false) value which specifies whether or not this cookie can only be retrieved over an SSL or HTTPS connection. Here, we set this depending on which environment our application is running in. As long as the environment is not development, we want to force this to be true. In development this isn't necessary because our application is not exposed to the internet, just us, and it's likely that you do not have an SSL proxy server setup locally to handle these requests. MAKE IT TRUE IN PRODUCTION ENVIRONMENT
        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });
        // res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

        res.json({roles, accessToken });
    } else {
        res.sendStatus(401);
    }
}

module.exports = { handleLogin };