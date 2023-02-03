
import { Schema } from 'mongoose'
import { LocationInterface } from '../interfaces/Interfaces'


const LocationSchema = new Schema<LocationInterface>({
   // _id: mongoose.Schema.Types.ObjectId,
    state: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20
    }
})

module.exports = LocationSchema