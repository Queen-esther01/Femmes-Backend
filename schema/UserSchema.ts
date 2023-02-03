import { Schema } from 'mongoose'
import { UserInterface } from '../interfaces/Interfaces'
const PreferenceSchema = require('./PreferenceSchema')
const SubscriptionSchema = require('./SubscriptionSchema')

const UserSchema = new Schema<UserInterface>({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    phone: {
        type: String,
        required: true,
        minlength: 11,
        maxlength: 11
    },
    state: {
        type: new Schema({
            name: {
                type: String,
                required: true,
                minlength: 3,
                maxlength: 20
            }
        }),
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024,
    },
    isAdmin: Boolean,
    isVerified: Boolean,
    preference: {
        type: PreferenceSchema
    },
    subscription: {
        type: new Schema({
            name: {
                type: String,
                required: true,
            },
            type: {
                type: String,
                required: true,
            },
            price: {
                type: String,
                required: true,
            }
        }),
    },
    history: {
        type: [new Schema({
            date: {
                type: Date,
                required: true,
                default: Date.now
            },
            status: {
                type: String,
                required: true
            },
            subscription: {
                type: new Schema({
                    name: {
                        type: String,
                        required: true,
                    },
                    type: {
                        type: String,
                        required: true,
                    },
                    price: {
                        type: Number,
                        required: true,
                    }
                }),
            }
        })]
    }
})

module.exports = UserSchema