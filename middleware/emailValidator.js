const emailValidator = require('deep-email-validator');

const isValidEmail = async (email) => {
    return emailValidator.validate(email)
}

module.exports = {isValidEmail}