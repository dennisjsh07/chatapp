const User = require('../model/user');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
require('dotenv').config();

function generateAccessToken(id, email){
    payload = {
        userId: id,
        email: email
    }
    const secretKey = process.env.TOKEN_SECRET;
    return jwt.sign(payload, secretKey)
}

exports.addUser = async (req, res, next)=>{
    try{
        // console.log(req.body);
        const {name, phone, email, password} = req.body;

        // validate...
        if(!name || !phone || !email || !password){
            return res.status(400).json({message: 'enter all the fields'})
        }

        // add error if user already exists...
        const existingUser = await User.findOne({
            where: {[Op.or]: [
                {email},
                {phone}
            ]}
        });
        if(existingUser){
            return res.status(400).json({error: 'user already exists'});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const response = await User.create({name, phone, email, password: hashedPassword});
        res.status(201).json({message: 'user added in successfully', newUserDetails: response});

    } catch(err){
        console.log('adding user failed >>>>', err);
        res.status(500).json({err: err});
    }
}

exports.userLogin = async(req,res,next)=>{
    try{
        // console.log(req.body);
        const {email, password} = req.body;

        // validate...
        if(!email || !password){
            return res.status(400).json({error: 'enter all the fields'})
        }

        // check if email and password is matching...
        const existingUser = await User.findOne({where: {email}});
        if(existingUser){
            const isPasswordMatch = await bcrypt.compare(password,existingUser.password);
            if(isPasswordMatch){
                res.status(200).json({message: 'user logged in successfully', token: generateAccessToken(existingUser.id, existingUser.email)});
            } else{
                res.status(404).json({err: 'user not found'});
            }
        }

    } catch(err){
        console.log('user login failed>>>>', err);
        res.status(500).json({err: err})
    }
}

module.exports.generateAccessToken = generateAccessToken;
 