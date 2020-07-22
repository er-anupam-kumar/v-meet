const user = require('../models/user')

const admin = async (req, res, next) => {

    try {
        if (req.user.user_type!==1) {
            throw new Error()
        }
        next()

    } catch (e) {
        res.status(401).send({ error: 'You are not authorized to perform this action' })
    }

}

module.exports = admin