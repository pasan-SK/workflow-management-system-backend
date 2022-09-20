const User = require("../../model/User")

const handleLogout = async (req, res) => {
    // also delete the accessToken (in frontend side)

    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); //No content success status
    const refreshToken = cookies.jwt;

    // Is refreshToken in db?
    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(204); //No Content success status
    }

    // Delete refreshToken in db
    foundUser.refreshToken = ''
    const result = await foundUser.save()
    console.log("REFRESH TOKEN DELETED", result);

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    res.sendStatus(204);
}

module.exports = { handleLogout }