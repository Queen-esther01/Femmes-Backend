import express, { Application } from 'express'
const error = require('../middleware/error')
const locations = require('../routes/Locations')
const users = require('../routes/User')
const login = require('../routes/Login')
const products = require('../routes/Products')
const brands = require('../routes/Brands')
const preference = require('../routes/Preference')
const packageRoute = require('../routes/Package')
const discount = require('../routes/Discount')
const subscription = require('../routes/Subscriptions')

module.exports = function(app: Application) {
    //MIDDLEWARES
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

    //Routes
    app.use('/api/v1/location', locations)
    app.use('/api/v1/users', users)
    app.use('/api/v1/auth', login)
    app.use('/api/v1/products', products)
    app.use('/api/v1/brands', brands)
    app.use('/api/v1/preference', preference)
    app.use('/api/v1/package', packageRoute)
    app.use('/api/v1/discount', discount)
    app.use('/api/v1/subscription', subscription)

    //Error Middleware
    app.use(error)
}