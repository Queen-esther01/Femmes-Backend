import { DiscountInterface } from "../interfaces/Interfaces"
import { model, ObjectId } from 'mongoose'
import { result } from "../utils/result"
let schema = require('../schema/DiscountSchema')
const mongoose = require('mongoose')


const Discount = model<DiscountInterface>('Discount', schema)



const createDiscount = async(data: DiscountInterface) =>{
    //Check If Discount Already Exists
    let discount = await Discount.findOne({name: data.name})
    if(discount) return result("Unsuccessful", 400, 'Discount already exists', null)

    //If package Does Not Exist, Create It
    discount = new Discount({
        percent: data.percent,
        name: data.name
    })
    
    let response = await discount.save()
    return result("Successful", 201, 'Discount created successfully', response)
    
}

const getDiscounts = async() =>{
    let discount = await Discount.find()
    if(discount.length === 0){
        return result("Successful", 204, "No discount found", [])
    } 
    return result("Successful", 200, "Discount retrieved successfully", discount)
}

const deleteDiscount = async(id: number) =>{
    if( !mongoose.Types.ObjectId.isValid(id) ){
        return result("Unsuccessful", 400, "ID is invalid type", null)
    }
    const discount = await Discount.findOneAndDelete({ _id: id })
    if(!discount){
        return result("Unsuccessful", 400, "Discount does not exist", null)
    }
    return result("Successful", 200, "Discount deleted successfully", discount)
}



module.exports = {
    createDiscount,
    getDiscounts,
    deleteDiscount,
}