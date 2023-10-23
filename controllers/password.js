const uuid = require('uuid');
const Sib = require('sib-api-v3-sdk');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const Password = require('../models/password');

require('dotenv').config();

const forgotPassword = async (req, res, next) => {
    try {
        const {email} = req.body;
        const user = await User.findOne({where: {email} });
        const id = uuid.v4();
        console.log(user);
        console.log(email);
        
        const client = Sib.ApiClient.instance
        const apiKey = client.authentications['api-key'];
        apiKey.apiKey = process.env.API_KEY;
        const tranEmailApi = new Sib.TransactionalEmailsApi();

        const sender = {
            email: 'aishumishra1999@gmail.com',
            name: 'Unique Facory'
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
                <a href="http://localhost:3000/password/resetpassword/${id}">Reset your Password</a>`
        })
        return res.status(201).json({success: true, message:"Reset password mail sent successfully"});
    }
    catch(err) {
        console.log(err);
        return res.status(500).json({success: false, error: err});
    }
}

const resetPassword = (req, res) => {
    const id = req.params.id;
    Password.findOne({where: {id}}).then((forgotpasswordrequest) => {
        if(forgotpasswordrequest) {
            forgotpasswordrequest.update({isactive: false});
            res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>

                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`
                                )
            res.end()
        }
    })
}

const updatePassword = (req, res) => {
    try{
        const{newpassword} = req.query;
        const{resetpasswordid} = req.params;
        Password.findOne({where: {id:resetpasswordid}}).then((resetpasswordrequest) => {
            User.findOne({where: {id:resetpasswordrequest.userId}}).then((user) => {
                console.log('userDetails', user);
                if(user) {
                    const saltRounds = 10;
                    bcrypt.genSalt(saltRounds, function(err, salt) {
                        if(err) {
                            console.log(err);
                            throw new Error(err);
                        }
                        bcrypt.hash(newpassword, salt, function(err, hash) {
                            if(err) {
                                console.log(err);
                                throw new Error(err);
                            }
                            user.update({password: hash}).then(() => {
                                res.status(201).json({message: 'New password updated successfully'});
                            })
                        })
                    })
                } else {
                    return res.status(404).json({error: 'No user exists', success: false});
                }
            })
        })
    } catch(err) {
        return res.status(403).json({success: false, error: err});
    }
}

module.exports = {
    forgotPassword,
    resetPassword,
    updatePassword
}