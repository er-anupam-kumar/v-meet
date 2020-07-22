const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
    user_type: {
        type: Number, //0=Student,1=Teacher,2-Admin
        default: 0,
    },
    first_name: {
        type: String,
        trim: true
    },
    last_name: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        index: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    email_verified: {
        type: Boolean,
        default: false
    },
    mobile: {
        type: String,
        minlength: 8,
        maxlength: 12,
        validate(value) {
            if (!validator.isMobilePhone(value)) {
                throw new Error('Phone number is invalid')
            }
        }
    },
    mobile_verified: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        trim: true,
        minlength: 6,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password should not contain word "password"')
            }
        }
    },
    gender: {
        type: String, //male,female
        minlength: 4,
        maxlength: 6,
        trim: true
    },
    dob: {
        type: String
    },
    profile_pic: {
        type: String
    },
    address: {
        type: String
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    last_login: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
})

userSchema.methods.toJSON = function() {
    const user = this
    const userObj = user.toObject()
    delete userObj.password
    return userObj
}

//Get auth tokens
userSchema.methods.getAuthToken = async function() {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_KEY)
    return token
}

userSchema.statics.findUserByCredentials = async(email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('Invalid credentials')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Invalid credentials')
    }
    return user
}

userSchema.pre('save', async function(next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

userSchema.plugin(uniqueValidator, { message: 'Error, {VALUE} is already taken.' })
const User = mongoose.model('User', userSchema)
module.exports = User