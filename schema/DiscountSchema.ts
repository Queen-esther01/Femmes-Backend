import { Schema } from 'mongoose'
import { DiscountInterface } from '../interfaces/Interfaces'


const DiscountSchema = new Schema<DiscountInterface>({
    percent: {
        type: Number,
        required: true,
        min: 5,
        max: 20
    },
    name: {
        type: String,
        required: true
    }
})

module.exports = DiscountSchema