const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

const User = require('../models/user');

function isstringinvalid(string){
    if(string == undefined || string.length === 0){
        return true
    } else {
        return false
    }
}

const addUser = async (req, res) => {
    try{
        const { name, email, password } = req.body;
        if(isstringinvalid(name) || isstringinvalid(email) || isstringinvalid(password)){
            return res.status(400).json({err: "Bad parameters. Something is missing"})
        }
        const saltrounds = 10;
        bcrypt.hash(password, saltrounds, async (err, hash) => {
            console.log(err);
            await User.create({ name, email, password: hash })
            res.status(201).json({message: "New user created successfully"})
        })
    }catch(err) {
        res.status(500).json(err);
    }
}

const generateAccessToken = (id, ispremiumuser) => {
    return jwt.sign({userId: id, ispremiumuser}, 'secretkey');
}

const loginUser = async (req, res) => {
    try{
        const { email, password } = req.body;
        if(isstringinvalid(email) || isstringinvalid(password)){
            return res.status(400).json({message: "email id or password is missing", success: false})
        }
        const user = await User.findAll({ where: { email } })
        if(user.length > 0){
            bcrypt.compare(password, user[0].password, (err, result) => {
                if(err){
                    return res.status(500).json({success: false, message: "Something went wrong"})
                }
                if(result === true){
                    return res.status(200).json({success: true, message: "User logged in successfully", 
                        token: generateAccessToken(user[0].id, user[0].ispremiumuser)})
                } else {
                    return res.status(400).json({success: false, message: "Password is incorrect"})
                }
            })
        } else {
            return res.status(404).json({success: false, message: "User does not exist"})
        }
    }catch(err) {
        res.status(500).json({ message: err, success: false });
    }
}

module.exports = {
    addUser,
    loginUser,
    generateAccessToken
}