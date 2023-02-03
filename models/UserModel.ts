import { model } from 'mongoose'
import { UserInterface, VerificationInterface } from '../interfaces/Interfaces'
import { result } from '../utils/result'
const { Locale } = require('./LocationModel')
const UserSchema = require('../schema/UserSchema')
const Token = require('../schema/VerificationSchema')
const sendVerificationEmail = require('../utils/emailTransporter')
const _ = require('lodash')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('config')
const crypto = import("crypto");

let user = UserSchema
user.methods.generateAuthToken = function(){
    const token = jwt.sign({
            _id: this._id,
            email: this.email,
            state: this.state,
            isAdmin: this.isAdmin
        }, 
        config.get('privateKey'),
        { expiresIn: '7 days' }
    )
    return token
}

const User = model<UserInterface>('User', user)

const getUsers = async() =>{
    let user = await User.find().select('-password')
    if(user.length === 0){
        if(user) return result("Successful", 204, "No users found", null)
    }
    return result("Successful", 200, "Users retrieved successfully", user)
}

const getUserById = async(req: any) =>{
    const user = await User.findById(req.user._id).select('-password')
    //console.log(user)
    return result("Successful", 200, 'User retrieved successfully', user)
}

const createUser = async(data: UserInterface, res:any) =>{
    //Check If Location Already Exists
    let user = await User.findOne({email: data.email})
    if(user) return result("Unsuccessful", 400, 'User already exists', null)

    let state = await Locale.findById(data.state)
    if(!state) return result("Unsuccessful", 400, 'State ID does not exist', null)
    
    //If Location Does Not Exist, Create It
    user = new User({
        name: data.name,
        email: data.email,
        phone: data.phone,
        state: {
            _id: state._id,
            name: state.state
        },
        password: data.password,
        isVerified: false,
        preference: null,
        subscription: null,
        history: []
    })

    //Hash user Password And Save User Details
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)
    await user.save()

    //Create User Verification Token And Save
    let verificationToken = await new Token({
        userId: user._id,
        token: Math.floor(1000 + Math.random() * 9000)
        // token: (await crypto).randomBytes(4).toString('hex')
    }).save()

    //Send Email
    if(verificationToken.token){
        //const message = `${process.env.BASE_URL}/users/verify/${user.id}/${verificationToken.token}`
        const message = `
            <div>
                <p>Hello,<p>
                <p>Thank you for creating a femmes account. Just one more tiny step before you get started </p>
                <p>We need you to verify your identity using this code: ${verificationToken.token}</p>
                <p>Please note that this code will expire in 5 minutes</p>
                <p>We can't wait to have you on board!<p><br/>
                <p>- Femmes</p>
            </div>
        `
        await sendVerificationEmail(user.email, 'Verify your account', message)
        const response =  _.pick(user, ["_id", "name", "email"])
        return result("Successful", 201, 'User created successfully', response)
    }
    else {
        return result("Unsuccessful", 400, 'Verification Token not sent', null)
    }
}

const verifyUser = async(data: VerificationInterface, res:any) =>{
    //Check If User Exists
    let user = await User.findById({_id: data.userId})
    if(!user) return result("Unsuccessful", 400, 'User does not exist', null)

    //Check if token exists
    let token = await Token.findOne({
        userId: user._id,
        token: data.token
    })
    if(!token) return result("Unsuccessful", 400, 'Token is invalid', null)
    
    //Delete token from DB
    await Token.findOneAndDelete({ userId : user._id})
    
    //Update user to verified
    await User.findByIdAndUpdate(user._id, {
        $set: {
            isVerified: true
        }
    }, { new: true })

    const message = `
        <div>
            <p>Welcome!<p>
            <p>We are so excited you decided to join us.</p>
            <p><p><br/>
            <p>- Femmes</p>
        </div>
    `
    await sendVerificationEmail(user.email, 'Account created successfully', message)

    const authToken = user.generateAuthToken()
    res.header('x-auth-token', authToken)
    const response =  _.pick(user, ["_id", "name", "email"])
    response.token = authToken
    return result("Successful", 201, 'User verified successfully', response)
  
}



module.exports = {
    getUsers,
    createUser,
    getUserById,
    verifyUser,
    User
}