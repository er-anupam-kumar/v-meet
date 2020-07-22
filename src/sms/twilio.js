const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const client = require('twilio')(accountSid, authToken)


const sendOtp = (mobile, otp) => {
    client.messages.create({
        body: `[#] Please use this OTP: ${otp} o6L1WCVllVW.`,
        to: `91${mobile}`,
        from: process.env.TWILIO_FROM
    }).then(message => console.log(message.sid)).catch(error => console.log('Twilio account error!'))
}

module.exports = {
    sendOtp
}