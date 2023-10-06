const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../model/user');

const authenticate = async(req, res, next)=>{
try{
    // get the token from the header...
    const token = req.header('Authorization');
    // console.log(token);

    // decrypt the token to get the userDetails encrypted...
    const userDetails = jwt.verify(token, process.env.TOKEN_SECRET);
    console.log('userId>>>>',userDetails.userId);

    // find the user using the id or email...
    const user = await User.findByPk(userDetails.userId);

    if(!user){
        return res.status(401).json({success: false});
    }

    // attach the user to the request object...
    req.user = user;

    next(); // this will flow to the next function in route.js file...

} catch(err){
    console.log('authentication failed :', err);
    res.status(500).json({err: 'authentication failed'})
}
}

module.exports = {authenticate};

 