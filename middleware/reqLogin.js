const jwt = require('jsonwebtoken')
const {jwtSrc} = require('../keys')
const mongoose = require('mongoose');
const User = mongoose.model("User")

module.exports = (req,res,next)=>{
    const {authorization} = req.headers
        if(!authorization){
            return res.status(401).json({error:"Login to access the content"})
        }
        const token = authorization.replace("Bearer ","")
        jwt.verify(token,jwtSrc,(err,payload)=>{
            if(err){
                return res.status(401).json({error:"Login to access the content"})
            }
            const {_id} = payload
            User.findById(_id)
            .then(userdata =>{
                req.user = userdata
                next()
            })
           
        })
    }
