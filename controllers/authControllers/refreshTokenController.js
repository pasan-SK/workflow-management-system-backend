const User = require("../../model/User")
const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    console.log("JWT COOKIE:", cookies.jwt)
    if (!cookies?.jwt) {
        return res.sendStatus(401)};
    const refreshToken = cookies.jwt;

    const foundUser =  await User.findOne({ refreshToken }).exec();
    if (!foundUser) {
        return res.sendStatus(403);} //Forbidden 

    // evaluate jwt 
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.email !== decoded.email) return res.sendStatus(403); //Forbidden
            const roles = Object.values(foundUser.roles);
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "email": decoded.email,
                        "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '300s' }
            );
            res.json({ accessToken })
        }
    );
}

module.exports = { handleRefreshToken }