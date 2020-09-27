const nodemailer = require('nodemailer')

transporter = nodemailer.createTransport({
    service: "qq",
    port: 465,
    auth: {
        user: "1194930385@qq.com",
        pass: "wjbgmhgtnezxheci"
    }
})

function sendResetLink(email, info) {
    mailOptions = {
        from: 'Yangyang<1194930385@qq.com>',
        to: email,
        subject: "Reset the password",
        text: `Hi ${info.name},to reset your password, please click on this link: https://pure-reaches-09538.herokuapp.com/users/${info.id}`
    }
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log(error);
        }
        transporter.close()
        console.log('mail sent:', info.response)
    })
}
function sendNotification(user, problem) {
    mailOptions = {
        from: 'Yangyang<1194930385@qq.com>',
        to: user.email,
        subject: "Notification of issue",
        text: `Hi ${user.userName}, your car ${user.carModel} has a new issue/recall: ${problem.issue}`
    }
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log(error);
        }
        transporter.close()
        console.log('mail sent:', info.response)
    })
}

module.exports = { sendResetLink, sendNotification };
