const nodemailer = require('nodemailer')
require('../utils/logger')

const sendVerificationEmail = async(email: string, subject: string, text: string) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.HOST,
            port: process.env.EMAIL_PORT,
            secure: true,
            auth: {
                user: process.env.USER,
                pass: process.env.PASS
            }
        })
        await transporter.sendMail({
            from: `We Are Femmes <no-reply@wearefemmes.com>`,
            to: email,
            subject: subject,
            html: text
        })
    }
    catch(e){
        //logger.log(e)
        console.log(e)
    }
}

module.exports = sendVerificationEmail