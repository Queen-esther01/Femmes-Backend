
import { Schema } from 'mongoose'
import { PreferenceInterface } from '../interfaces/Interfaces'
const BrandSchema = require('./BrandSchema')

const PreferenceSchema = new Schema<PreferenceInterface>({
    sanitaryProduct: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true
    },
    flowIntensity: {
        type: String,
        required: true
    },
    numberOfProducts: {
        type: Number,
        required: true
    },
    specificIllness: {
        type: String,
        maxlength: 100
    },
    additionalInfo: {
        type: String,
    }
})

module.exports = PreferenceSchema