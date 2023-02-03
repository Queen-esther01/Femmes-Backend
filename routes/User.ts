import express, { Request, Response } from 'express'
import { UserInterface, VerificationInterface } from '../interfaces/Interfaces';
const router = express.Router();
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const { getUsers, createUser, getUserById, verifyUser } = require('../models/UserModel')
const ObjectIdError = require('../utils/ObjectIdError')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')



router.get('/', [auth, admin], async(req:Request, res:Response) => {
    let result = await getUsers()
    return res.status(result.data.status).send(result)
})

router.get('/getUser', auth, async(req:Request, res:Response) => {
    const result = await getUserById(req)
    return res.status(200).send(result)
})

router.post('/', async(req:Request, res:Response) => {
    const { error } = validateUser(req.body)
    if(error){
        return ObjectIdError(res, error )
    }
    let result = await createUser(req.body, res)
    return res.status(result.data.status).send(result);
})

router.post('/verify', async(req:Request, res:Response) => {
    const { error } = validateVerification(req.body)
    if(error){
        return ObjectIdError(res, error, 'User ID is invalid' )
    }
    let result = await verifyUser(req.body, res)
    return res.status(result.data.status).send(result);
})



const validateUser = (user: UserInterface) => {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        phone: Joi.string().min(11).max(11).required(),
        state: Joi.objectId().required().messages({
            'objectId.base': 'State ID is invalid'
        }),
        password: Joi.string().min(5).max(255).required(),
    })
    let result = schema.validate(user);
    return result
}

const validateVerification = (data: VerificationInterface) => {
    const schema = Joi.object({
        userId: Joi.objectId().required().messages({
            'objectId.base': 'User ID is invalid'
        }),
        token: Joi.string().min(4).max(4).required()
    })
    let result = schema.validate(data);
    return result
}


module.exports = router