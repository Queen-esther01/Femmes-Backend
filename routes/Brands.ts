import express, { Request, Response } from 'express'
import { BrandInterface } from '../interfaces/Interfaces'
const { createBrand, deleteBrand } = require('../models/BrandsModel')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const Joi = require('joi')
const router = express.Router()



router.post('/', [auth, admin], async(req:Request, res:Response) => {
    const { error } = validateBrand(req.body)
    if(error){
        return res.status(400).send({
            result: "Unsuccessful",
            data: {
                status: 400,
                message: error.details[0].message
            }
        });
    }
    let result = await createBrand(req.body)
    return res.status(result.data.status).send(result);
})

router.delete('/', [auth, admin], async(req:Request, res:Response) => {
    const { error } = validateBrand(req.body)
    if(error){
        return res.status(400).send({
            result: "Unsuccessful",
            data: {
                status: 400,
                message: error.details[0].message
            }
        });
    }
    let result = await deleteBrand(req.body)
    return res.status(result.data.status).send(result);
})


const validateBrand = (brand: BrandInterface) =>{
    const schema = Joi.object({
        id: Joi.objectId().required(),
        brand: Joi.string().required(),
    })
    let result = schema.validate(brand)
    return result
}


module.exports = router