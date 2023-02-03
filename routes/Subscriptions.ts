import express, { Request, Response } from 'express'
import { SubscriptionInterface, TimelineInterface, userSubscriptionInterface } from '../interfaces/Interfaces'
const { saveUserSubscription, upgradeUserSubscription, downgradeUserSubscription, cancelUserSubscription, createSubscription, deleteSubscription, getSubscriptions, addTimeline, deleteTimeline } = require('../models/SubscriptionModel')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const Joi = require('joi')
const router = express.Router()



router.get('/', [auth], async(req:Request, res:Response) => {
    let result = await getSubscriptions(req.body)
    return res.status(result.data.status).send(result);
})

router.post('/', [auth, admin], async(req:Request, res:Response) => {
    const { error } = validateSubscription(req.body)
    if(error){
        return res.status(400).send({
            result: "Unsuccessful",
            data: {
                status: 400,
                message: error.details[0].message
            }
        });
    }
    let result = await createSubscription(req.body)
    return res.status(result.data.status).send(result);
})

router.post('/subscribe', auth, async(req:Request, res:Response) => {
    const { error } = validateUserSubscription(req.body)
    if(error){
        return res.status(400).send({
            result: "Unsuccessful",
            data: {
                status: 400,
                message: error.details[0].message
            }
        });
    }
    let result = await saveUserSubscription(req.body, req)
    return res.status(result.data.status).send(result);
})

router.post('/upgrade', auth, async(req:Request, res:Response) => {
    const { error } = validateUserSubscription(req.body)
    if(error){
        return res.status(400).send({
            result: "Unsuccessful",
            data: {
                status: 400,
                message: error.details[0].message
            }
        });
    }
    let result = await upgradeUserSubscription(req.body, req)
    return res.status(result.data.status).send(result);
})

router.post('/downgrade', auth, async(req:Request, res:Response) => {
    const { error } = validateUserSubscription(req.body)
    if(error){
        return res.status(400).send({
            result: "Unsuccessful",
            data: {
                status: 400,
                message: error.details[0].message
            }
        });
    }
    let result = await downgradeUserSubscription(req.body, req)
    return res.status(result.data.status).send(result);
})

router.post('/cancel', auth, async(req:Request, res:Response) => {
    const { error } = validateUserSubscription(req.body)
    if(error){
        return res.status(400).send({
            result: "Unsuccessful",
            data: {
                status: 400,
                message: error.details[0].message
            }
        });
    }
    let result = await cancelUserSubscription(req.body, req)
    return res.status(result.data.status).send(result);
})

router.post('/timeline', [auth, admin], async(req:Request, res:Response) => {
    const { error } = validateTimeline(req.body)
    if(error){
        return res.status(400).send({
            result: "Unsuccessful",
            data: {
                status: 400,
                message: error.details[0].message
            }
        });
    }
    let result = await addTimeline(req.body)
    return res.status(result.data.status).send(result);
})

router.delete('/timeline', [auth, admin], async(req:Request, res:Response) => {
    const { error } = validateTimeline(req.body)
    if(error){
        return res.status(400).send({
            result: "Unsuccessful",
            data: {
                status: 400,
                message: error.details[0].message
            }
        });
    }
    let result = await deleteTimeline(req.body)
    return res.status(result.data.status).send(result);
})

router.delete('/:id', [auth, admin], async(req:Request, res:Response) => {
    let result = await deleteSubscription(req.params.id)
    return res.status(result.data.status).send(result);
})





const validateSubscription = (data: SubscriptionInterface) =>{
    const schema = Joi.object({
        package: Joi.objectId().required(),
    })
    let result = schema.validate(data)
    return result
}

const validateTimeline = (data: TimelineInterface) =>{
    const schema = Joi.object({
        subscriptionId: Joi.objectId().required(),
        type: Joi.string().required(),
        price: Joi.number().required()
    })
    let result = schema.validate(data)
    return result
}

const validateUserSubscription = (data: userSubscriptionInterface) =>{
    const schema = Joi.object({
        subscriptionId: Joi.objectId().required(),
        userId: Joi.objectId().required(),
        type: Joi.string().required(),
        price: Joi.number().required()
    })
    let result = schema.validate(data)
    return result
}


module.exports = router