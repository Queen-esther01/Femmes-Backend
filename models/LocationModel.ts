import { LocationInterface } from "../interfaces/Interfaces"
import { model } from 'mongoose'
import { result } from "../utils/result"
let schema = require('../schema/LocationSchema')
const mongoose = require('mongoose')


const Locale = model<LocationInterface>('Location', schema)



const createLocation = async(data: LocationInterface) =>{
    //Check If Location Already Exists
    let location = await Locale.findOne({state: data.state})
    if(location) return result("Unsuccessful", 400, 'Location already exists', null)

    //If Location Does Not Exist, Create It
    location = new Locale({
        state: data.state
    })
    
    let response = await location.save()
    return result("Successful", 201, 'Location created successfully', response)
    
}

const getLocations = async() =>{
    let location = await Locale.find()
    if(location.length === 0){
        if(location) return result("Successful", 204, "No locations found", location)
    } 
    return result("Successful", 200, "Locations retrieved successfully", location)
}

const deleteLocation = async(id: number) =>{
    if( !mongoose.Types.ObjectId.isValid(id) ){
        return result("Unsuccessful", 400, "ID is invalid type", null)
    }
    const location = await Locale.findOneAndDelete({ _id: id })
    if(!location){
        return result("Unsuccessful", 400, "Location does not exist", null)
    }
    return result("Successful", 200, "Location deleted successfully", location)
}

const updateLocation = async(id: number, data: any) =>{
    if( !mongoose.Types.ObjectId.isValid(id) ){
        return result("Unsuccessful", 400, "ID is invalid type", null)
    }
    const location = await Locale.findByIdAndUpdate(id, {
        $set: {
            state: data.state
        }
    }, {new: true})
    if(location){
        return result("Successful", 200, "Location updated successfully", location)
    }
}

module.exports = {
    createLocation,
    getLocations,
    deleteLocation,
    updateLocation,
    Locale
}