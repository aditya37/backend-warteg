const jwtauth = require('jsonwebtoken');

module.exports = (req,res,next)=>{
    try{
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwtauth.verify(token, process.env.JWT_KEY);
        req.userData = decoded;
        next();
    }catch(error){
        return res.status(401).json({message:"Ohno!!! Empat Kosong Satu",success:"0",msg:error})
    }
};