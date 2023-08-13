const express = require('express');
const router = express.Router();

const User = require('../models/user');

const addUser = async(req, res, next) => {
    try{
        if(!req.body.password) {
            throw new Error('Password is mandatory');
        }

        const name = req.body.name;
        const password = req.body.password;
        const email = req.body.email;

        const data = await User.create({
            name: name,
            password: password,
            email: email
        })
        console.log(data);
        res.status(201).json({newUserDetail: data});
    } catch(err){
        console.log(err);
        res.status(500).json({error: err});
    }
}

// const getUser = async(req, res, next) => {
//     try{
//         const users = await User.findAll();
//         res.status(200).json({allUsers: users});
//     } catch(error){
//         console.log('Get user is failing', JSON.stringify(error));
//         res.status(500).json({error: error});
//     }
// }

module.exports = {
    addUser
}