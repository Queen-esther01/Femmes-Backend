import { Schema } from 'mongoose'
import { BrandInterface } from '../interfaces/Interfaces'


const BrandSchema = new Schema<BrandInterface>({
    brand: {
        type: String,
        required: true
    },
})

module.exports = BrandSchema