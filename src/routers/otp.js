const express = require('express')
const router = new express.Router
const Otp = require('../models/otp')
const otpGenerator = require('otp-generator')
const validator = require('validator')
const auth = require('../middlewares/auth')
const { sendOtp } = require('../sms/twilio')
const User = require('../models/user')
const { sendWelcomeEmail, sendByeByeEmail, sendEmailOtp } = require('../email/account')
require('../db/mongoose')

module.exports = router