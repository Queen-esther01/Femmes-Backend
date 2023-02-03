import { Schema } from 'mongoose'
import { SubscriptionInterface } from '../interfaces/Interfaces'


const SubscriptionSchema = new Schema<SubscriptionInterface>({
    package: {
        type: new Schema({
            name: {
                type: String,
                required: true,
            }
        }),
        required: true,
    },
    timeline: {
        type: [],
        required: true
    }
})

module.exports = SubscriptionSchema