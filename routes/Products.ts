import express, { Request, Response } from 'express'
import { ProductInterface } from '../interfaces/Interfaces'
const { getProducts, createProducts, deleteProduct, updateProduct } = require('../models/ProductsModel')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const Joi = require('joi')
const router = express.Router()



router.get('/', auth, async(req:Request, res:Response) => {
    //throw new Error('Could not get Location')
    let result = await getProducts()
    return res.status(result.data.status).send(result)
})

router.post('/', [auth, admin], async(req:Request, res:Response) => {
    const { error } = validateProducts(req.body)
    if(error){
        return res.status(400).send({
            result: "Unsuccessful",
            data: {
                status: 400,
                message: error.details[0].message
            }
        });
    }
    let result = await createProducts(req.body)
    return res.status(result.data.status).send(result);
})

router.delete('/:id', [auth, admin], async(req:Request, res:Response) => {
    let result = await deleteProduct(req.params.id)
    return res.status(result.data.status).send(result);
})

router.put('/:id', [auth, admin], async(req:Request, res:Response) => {
    const { error } = validateProducts(req.body)
    if(error){
        return res.status(400).send({
            result: "Unsuccessful",
            data: {
                status: 400,
                message: error.details[0].message
            }
        });
    }
    let result = await updateProduct(req.params.id, req.body)
    return res.status(result.data.status).send(result);
})


const validateProducts = (product: ProductInterface) =>{
    const schema = Joi.object({
        product: Joi.string().required(),
    })
    let result = schema.validate(product)
    return result
}


module.exports = router