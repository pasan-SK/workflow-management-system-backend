const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    console.log("TTTTTTTTTTTTTTTTTTT")
    if (!authHeader?.startsWith('Bearer ')) {
        console.log("OOOOOOOOOOOOO")
        return res.sendStatus(401);
    } //Unauthorized
    console.log("222222222222222")
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.sendStatus(403); //invalid token - Forbidden
            req.email = decoded.UserInfo.email;
            req.roles = decoded.UserInfo.roles;
            console.log("ROLES:", decoded.UserInfo.roles)
            next();
        }
    );
}

module.exports = verifyJWT