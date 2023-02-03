import { SubscriptionInterface, TimelineInterface, userSubscriptionInterface } from "../interfaces/Interfaces"
import { model, ObjectId } from 'mongoose'
import { result } from "../utils/result"
const { Package } = require('./PackageModel')
const { User } = require('./UserModel')
let schema = require('../schema/SubscriptionSchema')
const mongoose = require('mongoose')


const Subscription = model<SubscriptionInterface>('Subscription', schema)



const createSubscription = async(data: SubscriptionInterface) =>{
    //Check If Package Exists
    let packageInfo = await Package.findById({_id: data.package})
    if(!packageInfo) return result("Unsuccessful", 400, 'Package does not exist', null)

    let subscription = await Subscription.findOne({'package.name': packageInfo.name})
    if(subscription) return result("Unsuccessful", 400, 'Subscription for this package already exists', null)
    
    subscription = new Subscription({
        package: {
            _id: packageInfo._id,
            name: packageInfo.name
        },
        timeline: []
    })
    
    let response = await subscription.save()
    return result("Successful", 201, 'Subscription created successfully', response)
    
}

const saveUserSubscription = async(data: userSubscriptionInterface, req:any) =>{
    //Check If user Exists
    let user = await User.findById({_id: data.userId})
    if(req.user._id !== data.userId){
        return result("Unsuccessful", 400, 'Token does not belong to user', null)
    }
    if(!user) return result("Unsuccessful", 400, 'User does not exist', null)

    //Check if user already has subscription
    if(user.subscription !== null) return result("Unsuccessful", 400, 'User already has subscription', user.subscription)
    
    let subscription = await Subscription.findOne({_id: data.subscriptionId})
    if(!subscription) return result("Unsuccessful", 400, 'Subscription does not exist', null)

    let timeline = subscription.timeline.filter(value => value.type === data.type)
    if(!timeline.length){
        return result("Unsuccessful", 400, 'Timeline does not exist', null)
    }

    //save user subscription
    await User.findByIdAndUpdate(user._id, {
        $set: {
            subscription: {
                name: subscription.package.name,
                type: data.type,
                price: data.price
            }
        }
    }, { new: true })

    user.history.push({
        date: new Date(),
        status: 'Subscribed',
        subscription: {
            name: subscription.package.name,
            type: data.type,
            price: data.price
        }
    })

    await user.save()

    return result("Successful", 200, 'Subscription successful', data)
    
}

const upgradeUserSubscription = async(data: userSubscriptionInterface, req: any) =>{
    //Check If user Exists
    let user = await User.findById({_id: data.userId})
  
    if(req.user._id !== data.userId){
        return result("Unsuccessful", 400, 'Token does not belong to user', null)
    }
    if(!user) return result("Unsuccessful", 400, 'User does not exist', null)

    //Check if user already has subscription
    if(user.subscription === null) return result("Unsuccessful", 400, 'User does not have subscription to upgrade', user.subscription)
    if(user.subscription.type === data.type) return result("Unsuccessful", 400, 'Current subscription and upgrade are the same', user.subscription)
    
    let subscription = await Subscription.findOne({_id: data.subscriptionId})
    if(!subscription) return result("Unsuccessful", 400, 'Subscription does not exist', null)

    let timeline = subscription.timeline.filter(value => value.type === data.type)
    if(!timeline.length){
        return result("Unsuccessful", 400, 'Timeline does not exist', null)
    }

    if(data.price < user.subscription.price){
        return result("Unsuccessful", 400, 'Cannot upgrade to lower package, please downgrade instead', null)
    }

    //save user subscription
    await User.findByIdAndUpdate(user._id, {
        $set: {
            subscription: {
                name: subscription.package.name,
                type: data.type,
                price: data.price
            }
        }
    }, { new: true })

    user.history.push({
        date: new Date(),
        status: 'Upgraded',
        subscription: {
            name: subscription.package.name,
            type: data.type,
            price: data.price
        }
    })

    await user.save()

    return result("Successful", 200, 'Subscription upgraded successfully', data)
    
}

const downgradeUserSubscription = async(data: userSubscriptionInterface, req: any) =>{
    //Check If user Exists
    let user = await User.findById({_id: data.userId})
  
    if(req.user._id !== data.userId){
        return result("Unsuccessful", 400, 'Token does not belong to user', null)
    }
    if(!user) return result("Unsuccessful", 400, 'User does not exist', null)

    //Check if user already has subscription
    if(user.subscription === null) return result("Unsuccessful", 400, 'User does not have subscription to downgrade', user.subscription)
    if(user.subscription.type === data.type) return result("Unsuccessful", 400, 'Current subscription and downgrade are the same', user.subscription)
    
    let subscription = await Subscription.findOne({_id: data.subscriptionId})
    if(!subscription) return result("Unsuccessful", 400, 'Subscription does not exist', null)

    let timeline = subscription.timeline.filter(value => value.type === data.type)
    if(!timeline.length){
        return result("Unsuccessful", 400, 'Timeline does not exist', null)
    }

    if(data.price > user.subscription.price){
        return result("Unsuccessful", 400, 'Cannot downgrade to higher package, please upgrade instead', null)
    }

    //save user subscription
    await User.findByIdAndUpdate(user._id, {
        $set: {
            subscription: {
                name: subscription.package.name,
                type: data.type,
                price: data.price
            }
        }
    }, { new: true })

    user.history.push({
        date: new Date(),
        status: 'Downgraded',
        subscription: {
            name: subscription.package.name,
            type: data.type,
            price: data.price
        }
    })

    await user.save()

    return result("Successful", 200, 'Subscription downgraded successfully', data)
    
}

const cancelUserSubscription = async(data: userSubscriptionInterface, req: any) =>{
    //Check If user Exists
    let user = await User.findById({_id: data.userId})
  
    if(req.user._id !== data.userId){
        return result("Unsuccessful", 400, 'Token does not belong to user', null)
    }
    if(!user) return result("Unsuccessful", 400, 'User does not exist', null)

    //Check if user already has subscription
    if(user.subscription === null) return result("Unsuccessful", 400, 'User does not have subscription to cancel', user.subscription)
    
    let subscription = await Subscription.findOne({_id: data.subscriptionId})
    if(!subscription) return result("Unsuccessful", 400, 'Subscription does not exist', null)

    let timeline = subscription.timeline.filter(value => value.type === data.type)
    if(!timeline.length){
        return result("Unsuccessful", 400, 'Timeline does not exist', null)
    }

    if(data.type !== user.subscription.type && data.price !== user.subscription.price){
        return result("Unsuccessful", 400, 'User does not have selected subscription', null)
    }

    user.history.push({
        date: new Date(),
        status: 'Canceled',
        subscription: {
            name: subscription.package.name,
            type: data.type,
            price: data.price
        }
    })

    //save user subscription
    await User.findByIdAndUpdate(user._id, {
        $set: {
            subscription: null
        }
    }, { new: true })

    await user.save()

    return result("Successful", 200, 'Subscription canceled successfully', data)
    
}

const addTimeline = async(data: TimelineInterface) =>{
    let subscription = await Subscription.findOne({_id: data.subscriptionId})
    if(!subscription) return result("Unsuccessful", 400, 'Subscription does not exist', null)
    
    let timeline = subscription.timeline.filter(value => value.type === data.type)
    if(timeline.length > 0){
        return result("Unsuccessful", 400, 'Timeline already exists', null)
    }

    subscription.timeline.push({
        type: data.type,
        price: data.price
    })
    
    let response = await subscription.save()
    return result("Successful", 201, 'Timeline added successfully', response)
    
}

const deleteTimeline = async(data: TimelineInterface) =>{
    let subscription = await Subscription.findOne({_id: data.subscriptionId})
    if(!subscription) return result("Unsuccessful", 400, 'Subscription does not exist', null)
    
    let timeline = subscription.timeline.filter(value => value.type === data.type)
    if(!timeline.length){
        return result("Unsuccessful", 400, 'Timeline does not exist', null)
    }

    let filtered = subscription.timeline.filter(timeline => timeline.type !== data.type)
    subscription.timeline = filtered

    let response = await subscription.save()
    return result("Successful", 201, 'Timeline deleted successfully', response)
    
}

const getSubscriptions = async() =>{
    let subscription = await Subscription.find()
    if(subscription.length === 0){
        return result("Successful", 204, "No subscription found", [])
    } 
    return result("Successful", 200, "Subscriptions retrieved successfully", subscription)
}

const deleteSubscription = async(id: number) =>{
    if( !mongoose.Types.ObjectId.isValid(id) ){
        return result("Unsuccessful", 400, "ID is invalid type", null)
    }
    const discount = await Subscription.findOneAndDelete({ _id: id })
    if(!discount){
        return result("Unsuccessful", 400, "Subscription does not exist", null)
    }
    return result("Successful", 200, "Subscription deleted successfully", discount)
}



module.exports = {
    createSubscription,
    getSubscriptions,
    deleteSubscription,
    addTimeline,
    deleteTimeline,
    saveUserSubscription,
    upgradeUserSubscription,
    downgradeUserSubscription,
    cancelUserSubscription
}