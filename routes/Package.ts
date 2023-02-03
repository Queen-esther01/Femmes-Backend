import express, { Request, Response } from 'express'
import { PackageInterface, PackageItem } from '../interfaces/Interfaces'
const { createPackage, createPackageItem, deletePackageItem, getPackages, getPackage, updatePackage, deletePackage } = require('../models/PackageModel')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const Joi = require('joi')
const router = express.Router()



router.get('/', [auth], async(req:Request, res:Response) => {
    let result = await getPackages(req.body)
    return res.status(result.data.status).send(result);
})

router.get('/:id', [auth], async(req:Request, res:Response) => {
    let result = await getPackage(req.params.id)
    return res.status(result.data.status).send(result);
})

router.post('/', [auth, admin], async(req:Request, res:Response) => {
    const { error } = validatePackage(req.body)
    if(error){
        return res.status(400).send({
            result: "Unsuccessful",
            data: {
                status: 400,
                message: error.details[0].message
            }
        });
    }
    let result = await createPackage(req.body)
    return res.status(result.data.status).send(result);
})

router.post('/item', [auth, admin], async(req:Request, res:Response) => {
    const { error } = validatePackageItem(req.body)
    if(error){
        return res.status(400).send({
            result: "Unsuccessful",
            data: {
                status: 400,
                message: error.details[0].message
            }
        });
    }
    let result = await createPackageItem(req.body)
    return res.status(result.data.status).send(result);
})

router.delete('/item', [auth, admin], async(req:Request, res:Response) => {
    const { error } = validatePackageItem(req.body)
    if(error){
        return res.status(400).send({
            result: "Unsuccessful",
            data: {
                status: 400,
                message: error.details[0].message
            }
        });
    }
    let result = await deletePackageItem(req.body)
    return res.status(result.data.status).send(result);
})

router.put('/:id', [auth, admin], async(req:Request, res:Response) => {
    let result = await updatePackage(req.params.id, req.body)
    return res.status(result.data.status).send(result);
})

router.delete('/:id', [auth, admin], async(req:Request, res:Response) => {
    let result = await deletePackage(req.params.id)
    return res.status(result.data.status).send(result);
})


const validatePackage = (packageData: PackageInterface) =>{
    const schema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required(),
    })
    let result = schema.validate(packageData)
    return result
}

const validatePackageItem = (item: PackageItem) =>{
    const schema = Joi.object({
        id: Joi.objectId().required(),
        item: Joi.string().required(),
    })
    let result = schema.validate(item)
    return result
}


module.exports = router