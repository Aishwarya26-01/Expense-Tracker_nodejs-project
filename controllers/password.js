const Sib = require('sib-api-v3-sdk');

const User = require('../models/user');

require('dotenv').config();

const forgotPassword = async (req, res, next) => {
    try {
        const {email} = req.body;
        const user = await User.findOne({where: {email} });
        
        const client = Sib.ApiClient.instance
        const apiKey = client.authentications['api-key'];
        apiKey.apiKey = process.env.API_KEY;
        const tranEmailApi = new Sib.TransactionalEmailsApi();

        const sender = {
            email: 'aishumishra1999@gmail.com',
            name: 'Unique Factory'
        }

        const recievers = [
            {
                email: email
            }
        ]

        response = await tranEmailApi.sendTransacEmail({
            sender,
            to: recievers,
            subject: 'Reset Password',
            textContent: `Follow the link and reset the password`,
            htmlContent: `<h3>Click on the link below to reset the password</h3><br>
                <a href="http://localhost:3000/password/resetpassword/">Reset your Password</a>`
        })
        return res.status(201).json({success: true, message:"Reset password mail sent successfully"});
    }
    catch(err) {
        console.log(err);
        return res.status(500).json({success: false, error: err});
    }
}

module.exports = {
    forgotPassword
}