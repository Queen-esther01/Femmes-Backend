import { BrandInterface } from "../interfaces/Interfaces"
import { result } from "../utils/result"
const { Product } = require('./ProductsModel')

const createBrand = async(data:BrandInterface) => {

    //Check If product Exists
    let product = await Product.findById(data.id)
    if(!product) return result("Unsuccessful", 400, 'Product does not exist', null)

    if(product.brands.includes(data.brand)){
        return result("Unsuccessful", 400, 'Brand already exists', null)
    }

    //If Product exists, add brand
    product.brands.push(data.brand)

    let response = await product.save()
    return result("Successful", 201, 'Brand added successfully', response)
}

const deleteBrand = async(data:BrandInterface) =>{

    let product = await Product.findById(data.id)
    if(!product) return result("Unsuccessful", 400, 'Product does not exist', null)

    if(!(product.brands.includes(data.brand))){
        return result("Unsuccessful", 400, 'Brand does not exist', null)
    }
    let filtered = product.brands.filter((brand : string) => brand !== data.brand)
    product.brands = filtered
    await product.save()
    return result("Successful", 200, "Product deleted successfully", { brand: data.brand})
}

module.exports = {
    createBrand,
    deleteBrand
}