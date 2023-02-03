import { Schema, model } from 'mongoose'
import { VerificationInterface } from '../interfaces/Interfaces'

const VerificationSchema = new Schema<VerificationInterface>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    token: {
        type: String,
        required: true,
        unique: true,
        createdAt: { 
            type: Date,
            expires: '1m',
            default: Date.now
        }
    }
})

const Token = model('token', VerificationSchema)

module.exports = Token