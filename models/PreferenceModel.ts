import { PreferenceInterface  } from "../interfaces/Interfaces"
import { result } from "../utils/result"
const { User } = require('./UserModel')
const { Product } = require('./ProductsModel')

const addPreference = async(id: any, data:PreferenceInterface, req:any) => {
    //Check If User Exists
    if(req.user._id !== id){
        return result("Unsuccessful", 400, 'Token does not belong to user', null)
    }
    let user = await User.findById(id)
    if(!user) return result("Unsuccessful", 400, 'User does not exist', null)

    let product = await Product.findById(data.sanitaryProduct)
    
    if(!product) return result("Unsuccessful", 400, 'Product does not exist', null)
    
    if(!(product.brands.includes(data.brand))){
        return result("Unsuccessful", 400, 'Brand does not exist', null)
    }

    data.sanitaryProduct = product.product

    //If user exists, add preference
    await User.findByIdAndUpdate(user._id, {
        $set: {
            preference: data
        }
    }, { new: true })

    return result("Successful", 200, 'Preference added successfully', user)
}

// const updatePreference = async(id: ObjectId, data: any) =>{
//     //Check If User Exists
//     let user = await User.findById(id)
//     if(!user) return result("Unsuccessful", 400, 'User does not exist', null)

//     let product = await Product.findById(data.sanitaryProduct)
    
//     if(!product) return result("Unsuccessful", 400, 'Product does not exist', null)
    
//     if(!(product.brands.includes(data.brand))){
//         return result("Unsuccessful", 400, 'Brand does not exist', null)
//     }

//     //If user exists, add preference
//     await User.findByIdAndUpdate(user._id, {
//         $set: {
//             preference: data
//         }
//     }, { new: true })

//     return result("Successful", 200, "Preference updated successfully", product)

// }


module.exports = {
    addPreference,
}