const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const uniqueValidator = require('mongoose-unique-validator')

const otpSchema = mongoose.Schema({
    email: {
        type: String
    },
    name: {
        type: String
    },
    otp: {
        type: String,
        minlength: 4,
        maxlength: 4
    },
    attempts: {
        type: Number,
        default: 3
    }
}, {
    timestamps: true
})

const Otp = mongoose.model('Otp', otpSchema)
module.exports = Otp