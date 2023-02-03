
import { Schema } from 'mongoose'
import { PackageInterface } from '../interfaces/Interfaces'


const PackageSchema = new Schema<PackageInterface>({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    items: {
        type: [String],
        required: true
    }
})

module.exports = PackageSchema