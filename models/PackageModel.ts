import { PackageInterface, PackageItem } from "../interfaces/Interfaces"
import { model, ObjectId } from 'mongoose'
import { result } from "../utils/result"
let schema = require('../schema/PackageSchema')
const mongoose = require('mongoose')


const Package = model<PackageInterface>('Package', schema)



const createPackage = async(data: PackageInterface) =>{
    //Check If package Already Exists
    let packageInfo = await Package.findOne({name: data.name})
    if(packageInfo) return result("Unsuccessful", 400, 'Package already exists', null)

    //If package Does Not Exist, Create It
    packageInfo = new Package({
        name: data.name,
        description: data.description,
        price: data.price,
        items: []
    })
    
    let response = await packageInfo.save()
    return result("Successful", 201, 'Package created successfully', response)
    
}

const createPackageItem = async(data: PackageItem) =>{
    //Check If package Already Exists
    let packageInfo = await Package.findById(data.id)
    if(!packageInfo) return result("Unsuccessful", 400, 'Package does not exist', null)

    if(packageInfo.items.includes(data.item)){
        return result("Unsuccessful", 400, 'Item already exists', null)
    }

    //If Product exists, add item
    packageInfo.items.push(data.item)
    
    let response = await packageInfo.save()
    return result("Successful", 201, 'Item added successfully', response.items)
    
}
const deletePackageItem = async(data: PackageItem) =>{
    //Check If package Already Exists
    let packageInfo = await Package.findById(data.id)
    if(!packageInfo) return result("Unsuccessful", 400, 'Package does not exist', null)

    if(!(packageInfo.items.includes(data.item))){
        return result("Unsuccessful", 400, 'Item does not exist', null)
    }
    
    let filtered = packageInfo.items.filter((item : string) => item !== data.item)
    packageInfo.items = filtered
    await packageInfo.save()
    
    return result("Successful", 201, 'Item deleted successfully', { item : data.item})
    
}

const getPackages = async() =>{
    let packageInfo = await Package.find()
    if(packageInfo.length === 0){
        return result("Successful", 204, "No Packages found", packageInfo)
    } 
    return result("Successful", 200, "Packages retrieved successfully", packageInfo)
}

const getPackage = async(id: ObjectId) =>{
    if( !mongoose.Types.ObjectId.isValid(id) ){
        return result("Unsuccessful", 400, "ID is invalid type", null)
    }
    let packageInfo = await Package.findById(id)
    if(!packageInfo){
        return result("Unsuccessful", 400, 'Package does not exist', null)
    } 
    return result("Successful", 200, "Packages retrieved successfully", packageInfo)
}

const updatePackage = async(id: number, data: any) =>{
    if( !mongoose.Types.ObjectId.isValid(id) ){
        return result("Unsuccessful", 400, "ID is invalid type", null)
    }
    let packageInfo = await Package.findOne({_id: id})
    if(!packageInfo) return result("Unsuccessful", 400, 'Package does not exist', null)

    const packageData = await Package.findByIdAndUpdate(id, {
        $set: {
            name: data.name,
            price: data.price,
            description: data.description
        }
    }, {new: true})
    
    return result("Successful", 200, "Package updated successfully", packageData)
}

const deletePackage = async(id: number) =>{
    if( !mongoose.Types.ObjectId.isValid(id) ){
        return result("Unsuccessful", 400, "ID is invalid type", null)
    }
    const packageInfo = await Package.findOneAndDelete({ _id: id })
    if(!packageInfo){
        return result("Unsuccessful", 400, "Package does not exist", null)
    }
    return result("Successful", 200, "Package deleted successfully", packageInfo)
}



module.exports = {
    createPackage,
    getPackages,
    getPackage,
    deletePackage,
    updatePackage,
    createPackageItem,
    deletePackageItem,
    Package
}