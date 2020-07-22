const express = require('express')
const router = new express.Router()
const auth = require('../middlewares/auth')
const multer = require('multer')
const sharp = require('sharp')
const validator = require('validator')
const { sendWelcomeEmail, sendByeByeEmail, sendEmailOtp } = require('../email/account')
const Otp = require('../models/otp')
const otpGenerator = require('otp-generator')
const { sendOtp } = require('../sms/twilio')

//Connect Database
require('../db/mongoose')
    //Import models for database manipulations
const User = require('../models/user')

router.post('/login', async(req, res) => {

    let errors = {}
    let status = true

    if (!req.query.email || req.query.email && (!validator.isEmail(req.query.email))) {
        errors.email = `Please enter valid email.`
        status = false
    }

    if (!req.query.password) {
        errors.passowrd = `Please provide password.`
        status = false
    }

    if (status === false) {
        return res.send({
            success: false,
            errors,
            status: 400
        })
    }

    try {
        const user = await User.findUserByCredentials(req.query.email, req.query.password)
        const token = await user.getAuthToken()
        res.send({
            success: true,
            message: `Logged in successfully.`,
            user,
            token
        })
    } catch (e) {
        res.send({
            success: false,
            status: 404,
            message: `Invalid credentials.`
        })
    }
})

router.post('/signup', async(req, res) => {
    let errors = {}
    let status = true

    if (!req.query.email || req.query.email && (!validator.isEmail(req.query.email))) {
        errors.email = `Please enter valid email.`
        status = false
    }

    if (!req.query.name) {
        errors.name = `Please provide valid name.`
        status = false
    }

    if (status === false) {
        return res.send({
            success: false,
            errors
        })
    }

    try {
        const otp = await otpGenerator.generate(4, { digits: true, alphabets: false, upperCase: false, specialChars: false });
        const email = req.query.email
        let emailAndOtp = await Otp.findOne({ email })

        if (emailAndOtp) {
            emailAndOtp.otp = otp
            emailAndOtp.attempts = 3
        } else {
            emailAndOtp = new Otp({ email, otp, name: req.query.name })
        }

        await emailAndOtp.save()
        await sendEmailOtp(email, otp)

        res.send({
            success: true,
            email,
            message: "Please enter otp sent to your email."
        })
    } catch (e) {
        return res.status(500).send({
            success: false,
            message: 'Something went wrong.'
        })
    }
})

router.post('/verify-otp', async(req, res) => {
    let errors = {}
    let status = true
    const otp = req.query.otp
    const email = req.query.email
    try {

        if (!req.query.email || req.query.email && (!validator.isEmail(req.query.email))) {
            errors.email = `Please enter valid email.`
            status = false
        }

        const checkEmail = await Otp.findOne({ email, otp })

        if (!checkEmail) {
            errors.otp = `Please enter valid otp.`
            status = false
        }

        if (status === false) {
            return res.send({
                success: false,
                errors
            })
        }

        let user = await User.findOne({ email })

        if (!user) {
            user = new User({ email: checkEmail.email, first_name: checkEmail.name })
            user.email_verified = true
            await user.save()
        }

        res.send({
            success: true,
            email,
            message: "Otp verified successfully. Please create your password."
        })

    } catch (e) {
        return res.status(500).send({
            success: false,
            message: 'Something went wrong.'
        })
    }
})

router.post('/password', async(req, res) => {
    let errors = {}
    let status = true
    const password = req.query.password
    const email = req.query.email
    try {

        if (!req.query.email || req.query.email && (!validator.isEmail(req.query.email))) {
            errors.email = `Please enter valid email.`
            status = false
        }

        const user = await User.findOne({ email })

        if (!user) {
            errors.email = `Please enter valid email.`
            status = false
        }

        if (status === false) {
            return res.send({
                success: false,
                errors
            })
        }

        user.password = password
        user.user_type = req.query.user_type ? req.query.user_type : 0
        await user.save()

        res.send({
            success: true,
            user,
            token: await user.getAuthToken(),
            message: "Password created successfully."
        })

    } catch (e) {
        return res.status(500).send({
            success: false,
            message: 'Something went wrong.'
        })
    }
})

router.get('/me', auth, async(req, res) => {
    try {
        res.send({
            success: true,
            user: req.user,
        })
    } catch (e) {
        res.status(500).send({
            success: false,
            message: "Something went wrong"
        })
    }
})

router.post('/updateInfo', async(req, res) => {
    console.log(req.formData)
    res.send('ok')
})

module.exports = router