import express, { Request, Response } from 'express'
import { UserInterface, ResetPasswordInterface } from '../interfaces/Interfaces';
const router = express.Router();
const Joi = require('joi')
const { loginUser, forgotPassword, resetPassword } = require('../models/LoginModel')


router.post('/login', async(req:Request, res:Response) => {
    const { error } = validateUser(req.body)
    if(error){
        return res.status(400).send(error.details[0].message);
    }
    let result = await loginUser(req.body)
    return res.status(result.data.status).send(result);
})

router.post('/forgot-password', async(req:Request, res:Response) => {
    const { error } = validateForgotPassword(req.body)
    if(error){
        return res.status(400).send(error.details[0].message);
    }
    let result = await forgotPassword(req.body)
    return res.status(result.data.status).send(result);
})

router.post('/reset-password', async(req:Request, res:Response) => {
    const { error } = validateResetPassword(req.body)
    if(error){
        return res.status(400).send(error.details[0].message);
    }
    let result = await resetPassword(req.body)
    return res.status(result.data.status).send(result);
})



const validateUser = (user: UserInterface) => {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
    })
    let result = schema.validate(user);
    return result
}

const validateForgotPassword = (user: UserInterface) => {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email()
    })
    let result = schema.validate(user);
    return result
}

const validateResetPassword = (user: ResetPasswordInterface) => {
    const schema = Joi.object({
        password: Joi.string().min(5).max(255).required(),
        token: Joi.string().required(),
    })
    let result = schema.validate(user);
    return result
}


module.exports = router