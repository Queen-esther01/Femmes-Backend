import express, { Request, Response } from 'express'
import { PreferenceInterface } from '../interfaces/Interfaces'
const { addPreference } = require('../models/PreferenceModel')
const auth = require('../middleware/auth')
const Joi = require('joi')
const router = express.Router()



router.post('/:id', [auth], async(req:Request, res:Response) => {
    const { error } = validatePreference(req.body)
    if(error){
        return res.status(400).send({
            result: "Unsuccessful",
            data: {
                status: 400,
                message: error.details[0].message
            }
        });
    }
    let result = await addPreference(req.params.id, req.body, req)
    return res.status(result.data.status).send(result);
})



const validatePreference = (preference: PreferenceInterface) =>{
    const schema = Joi.object({
        sanitaryProduct: Joi.string().required(),
        brand: Joi.string().required(),
        flowIntensity: Joi.string().required(),
        numberOfProducts: Joi.number().required(),
        specificIllness: Joi.string().allow(null, ''),
        additionalInfo: Joi.string().allow(null, ''),
    })
    let result = schema.validate(preference)
    return result
}


module.exports = router