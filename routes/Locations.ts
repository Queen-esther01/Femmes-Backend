import express, { Request, Response } from 'express'
import { LocationInterface } from '../interfaces/Interfaces'
const { createLocation, getLocations, deleteLocation, updateLocation } = require('../models/LocationModel')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const Joi = require('joi')
const router = express.Router()



router.get('/', auth, async(req:Request, res:Response) => {
    //throw new Error('Could not get Location')
    let result = await getLocations()
    return res.status(result.data.status).send(result)
})

router.post('/', [auth, admin], async(req:Request, res:Response) => {
    const { error } = validateLocation(req.body)
    if(error){
        return res.status(400).send({
            result: "Unsuccessful",
            data: {
                status: 400,
                message: error.details[0].message
            }
        });
    }
    let result = await createLocation(req.body)
    return res.status(result.data.status).send(result);
})

router.delete('/:id', [auth, admin], async(req:Request, res:Response) => {
    let result = await deleteLocation(req.params.id)
    return res.status(result.data.status).send(result);
})

router.put('/:id', [auth, admin], async(req:Request, res:Response) => {
    let result = await updateLocation(req.params.id, req.body)
    return res.status(result.data.status).send(result);
})


const validateLocation = (location: LocationInterface) =>{
    const schema = Joi.object({
        state: Joi.string().min(3).max(20).required().messages({
            'string.min': 'State length must be at least 3 characters'
        }),
    })
    let result = schema.validate(location)
    return result
}


module.exports = router