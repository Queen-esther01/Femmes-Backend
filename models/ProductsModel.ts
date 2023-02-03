import { ProductInterface } from "../interfaces/Interfaces"
import { model } from 'mongoose'
import { result } from "../utils/result"
let schema = require('../schema/ProductSchema')
const mongoose = require('mongoose')


const Product = model<ProductInterface>('Product', schema)


const getProducts = async() =>{
    let products = await Product.find()
    if(products.length === 0){
        if(products) return result("Successful", 204, "No products found", [])
    } 
    return result("Successful", 200, "Products retrieved successfully", products)
}

const createProducts = async(data:ProductInterface) => {
    //Check If product Already Exists
    let product = await Product.findOne({product: data.product})
    if(product) return result("Unsuccessful", 400, 'Product already exists', null)

    //If Product Does Not Exist, Create It
    product = new Product({
        product: data.product,
        brands: []
    })

    let response = await product.save()
    return result("Successful", 201, 'Product created successfully', response)
}

const deleteProduct = async(id: number) =>{
    if( !mongoose.Types.ObjectId.isValid(id) ){
        return result("Unsuccessful", 400, "ID is invalid type", null)
    }
    const product = await Product.findOneAndDelete({ _id: id })
    if(!product){
        return result("Unsuccessful", 400, "Product does not exist", null)
    }
    return result("Successful", 200, "Product deleted successfully", product)
}

const updateProduct = async(id: number, data: any) =>{
    if( !mongoose.Types.ObjectId.isValid(id) ){
        return result("Unsuccessful", 400, "ID is invalid type", null)
    }
    const product = await Product.findByIdAndUpdate(id, {
        $set: {
            product: data.product
        }
    }, {new: true})
    if(product){
        return result("Successful", 200, "Product updated successfully", product)
    }
}

module.exports = {
    getProducts,
    createProducts,
    deleteProduct,
    updateProduct,
    Product
}