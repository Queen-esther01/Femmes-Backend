import { model } from 'mongoose'
import { UserInterface, ResetPasswordInterface } from '../interfaces/Interfaces'
import { result } from '../utils/result'
const sendVerificationEmail = require('../utils/emailTransporter')
const UserSchema = require('../schema/UserSchema')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('config')

const User = model<UserInterface>('User', UserSchema)



const loginUser = async(data: UserInterface) =>{
    //Check if user exists
    let user = await User.findOne({email: data.email})
    if(!user) return result("Unsuccessful", 400, 'Invalid email or password', null)
    if (!user.isVerified) return result("Unsuccessful", 401, 'This account is not verified', null)

    //If user exists, compare password
    const validPassword = await bcrypt.compare(data.password, user.password)
    if(!validPassword){
        return result("Unsuccessful", 400, 'Invalid email or password', null)
    }
    const token = user.generateAuthToken()

    return result("Successful", 200, 'Login successful', {token: token})
    
}

const forgotPassword = async(data: UserInterface) =>{
    //Check if user exists
    let user = await User.findOne({email: data.email})
    if(!user) return result("Unsuccessful", 400, 'Invalid email or password', null)
    if (!user.isVerified) return result("Unsuccessful", 401, 'This account is not verified', null)

    const token = user.generateAuthToken()

    //If user exists, send email
    const message = `
            <div>
                <p>Hello,<p>
                <p>We received a request to reset the password on your account.</p>
                <p>You can reset your password by clicking on the link below:</p>
                <p>${process.env.BASE_URL}/reset-password/${token}</p>
                <p>Please report this request at <a mailto:info@wearefemmes.com>info@wearefemmes.com</a> if it was not initiated by you.<p><br/>
                <p>- Femmes</p>
            </div>
        `
    await sendVerificationEmail(user.email, 'Forgot Password', message)
    return result("Successful", 200, 'Password reset sent successfully', null)
}

const resetPassword = async(data: ResetPasswordInterface) =>{

    //Check if token is valid
    const decodedPayload = jwt.verify(data.token, config.get('privateKey'))
    if(!decodedPayload) return result("Unsuccessful", 401, 'Invalid Token', null)
 
    //If token is valid, update user password and send email
    const salt = await bcrypt.genSalt(10)
    const password = await bcrypt.hash(data.password, salt)

    if(decodedPayload._id){
        await User.findByIdAndUpdate(decodedPayload._id, {
            $set: {
                password: password
            }
        }, { new: true })

        const message = `
            <div>
                <p>Hello,<p>
                <p>Your password has been reset successfully.</p>
                <p>You can now sign in with your new credentials.</p>
                <p>Please report this request at <a mailto:info@wearefemmes.com>info@wearefemmes.com</a> if it was not initiated by you.<p><br/>
                <p>- Femmes</p>
            </div>
        `
        await sendVerificationEmail(decodedPayload.email, 'Password Reset Successful', message)
        return result("Successful", 200, 'Password reset successfully', null)
    }
}



module.exports = {
    loginUser,
    forgotPassword,
    resetPassword
}