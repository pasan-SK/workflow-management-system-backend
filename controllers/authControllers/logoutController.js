const User = require("../../model/User")
const { logEvents } = require("../../middleware/logEvents")

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
    const email = foundUser.email
    const id = foundUser._id
    foundUser.refreshToken = ''
    const result = await foundUser.save()
    console.log("REFRESH TOKEN DELETED", result);

    logEvents(`LOGOUT\t${email}\t${id}`, 'loginLogoutLog.txt')

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    res.sendStatus(204);
}

module.exports = { handleLogout }