// const { describe } = require("node:test");
const { UserModel } = require('../../../models/UserModel')
const jwt = require('jsonwebtoken')
const config = require('config')
const mongoose = require('mongoose')

describe('user - generateAuthToken', () =>{
    it('should return a valid JWT', () => {
        const payload = { _id: new mongoose.Types.ObjectID().toHexString(), isAdmin: true}
        const user = new UserModel(payload)
        const token = user.generateAuthToken()
        const decoded = jwt.verify(token, config.get('privateKey'))
        expect(decoded).toMatchObject(payload)
    })
})