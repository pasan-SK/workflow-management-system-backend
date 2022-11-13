require('dotenv').config();

const nodemailer = require('nodemailer');
const CONFIRM_API = process.env.HOST_DOMAIN+ 'public/email/confirm'
const user = process.env.EMAIL
const password = process.env.EMAIL_PASS

const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user:user,
        pass:password,
    }
});

const sendConfirmationEmail = async (name, email, confirmationCode, type='confirmation') => {

    if (type==='confirmation'){
        const val = await transport.sendMail({
            from: {name:"GID-Registration Confirmation",
            address: user
            },
            to: email,
            subject: "Please confirm your account",
            html: `<h1>Email Confirmation</h1>
                    <h2>Hello ${name}</h2>
                    <p>Thanks for joining in. Please confirm your email by clicking on the following link.</p>
                    <a href=${CONFIRM_API}/${confirmationCode}> Click Here</a>
            `
        });

        if(val) {
            return true;
        }else{
            return false;
        }

    }else {

    }
}

module.exports = {sendConfirmationEmail}