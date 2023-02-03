import express, { Request, Response } from 'express'
import { DiscountInterface } from '../interfaces/Interfaces'
const { createDiscount, getDiscounts, deleteDiscount } = require('../models/DiscountModel')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const Joi = require('joi')
const router = express.Router()



router.get('/', [auth], async(req:Request, res:Response) => {
    let result = await getDiscounts(req.body)
    return res.status(result.data.status).send(result);
})

router.post('/', [auth, admin], async(req:Request, res:Response) => {
    const { error } = validateDiscount(req.body)
    if(error){
        return res.status(400).send({
            result: "Unsuccessful",
            data: {
                status: 400,
                message: error.details[0].message
            }
        });
    }
    let result = await createDiscount(req.body)
    return res.status(result.data.status).send(result);
})

router.delete('/:id', [auth, admin], async(req:Request, res:Response) => {
    let result = await deleteDiscount(req.params.id)
    return res.status(result.data.status).send(result);
})





const validateDiscount = (data: DiscountInterface) =>{
    const schema = Joi.object({
        percent: Joi.number().integer().min(5).max(20).required(),
        name: Joi.string().required(),
    })
    let result = schema.validate(data)
    return result
}


module.exports = router