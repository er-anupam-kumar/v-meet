const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SEND_GRID_API_KEY)


const sendWelcomeEmail = (email, name) => {

    sgMail.send({
        to: email,
        from: 'anupamkumarrao@gmail.com',
        subject: 'Welcome to Homifi',
        text: `Welcome to Homifi, ${name}.`
    })

}

const sendEmailOtp = (email, otp) => {

    sgMail.send({
        to: email,
        from: 'anupamkumarrao@gmail.com',
        subject: 'Email verification on Soulyog',
        text: `Greetings from Soulyog! Your one time password is ${otp}.`
    })

}

const sendByeByeEmail = (email, name) => {

    sgMail.send({
        to: email,
        from: 'anupamkumarrao@gmail.com',
        subject: 'Account deleted on Homifi',
        text: `You account is deleted, ${name}.`
    })

}

module.exports = {
    sendWelcomeEmail,
    sendByeByeEmail,
    sendEmailOtp
}