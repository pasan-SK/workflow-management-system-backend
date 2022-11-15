require('dotenv').config();

const nodemailer = require('nodemailer');
const CONFIRM_API = process.env.HOST_DOMAIN+ 'public/email/confirm'
const RESET_API = process.env.HOST_DOMAIN+'password/reset/email'
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
            from: {name:"Galle Irrigation Dept.",
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

const sendPasswordResetMail = async (name, email, newPassword, user_id) => {
    const val = await transport.sendMail({
        from: {name:"Galle Irrigation Dept.",
        address: user
        },
        to: email,
        subject: "Account password reset request",
        html: `<h1>Password Reset Request</h1>
                <h2>Hello ${name}</h2>
                <p>There was a request to reset your password from your account. If you have not requested for password reset then ignore this email, otherwise click the below button. Clicking the below button will reset the password to <b>${newPassword}</b>. It is advised that you change the password after logging in to your account.<br>This link is only valid for 10 minutes</p>
                <a href=${RESET_API}/${user_id}>Click Here</a>
        `
    });

    if(val){
        return true;
    }else {
        return false;
    }
}

module.exports = { sendConfirmationEmail, sendPasswordResetMail }