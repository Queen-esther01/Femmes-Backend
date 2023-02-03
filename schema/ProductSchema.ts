import { Schema } from 'mongoose'
import { ProductInterface } from '../interfaces/Interfaces'


const ProductSchema = new Schema<ProductInterface>({
    product: {
        type: String,
        required: true
    },
    brands: {
        type: [String],
        required: true
    }
})

module.exports = ProductSchema