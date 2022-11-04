const allDomains = require('../config/emailDomainList');

const isValidEmail = async (email) => {
    const domain = email.split('@')[1].trim()
    if(allDomains.includes(domain)){
        return true;
    }else{
        return false;
    }
}

module.exports = {isValidEmail}