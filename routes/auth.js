const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const User = mongoose.model("User");
const jwt = require('jsonwebtoken');
const {jwtSrc} = require('../keys')
const reqAccess = require('../middleware/reqLogin')

router.get('/protected',reqAccess,(req,res) =>{
    res.send("hello from protected URL")
})
router.post('/signup',(req,res) =>{
    const {name,email,password,pic} = req.body
    if(!name || ! email || !password){
        res.json({error:"Please add all the values"})
    }
    User.findOne({email:email})
    .then((saveData) =>{
        if(saveData){
            return res.status(422).json({error:"This email is already registered"})
        }
        bcrypt.hash(password,13)
        .then(hashed =>{
            const user = new User({
                name,
                email,
                password:hashed,
                pic
            })
    
            user.save()
            .then(user =>{
                res.json({message:"Saved Successfully"})
            })
            .catch(err =>{
                console.log(err)
            })

        })
        
    })
    .catch(err =>{
        console.log(err)
    })
})

router.post('/signin',(req,res) =>{
    const {email,password} = req.body
    if(!email || ! password){
       return res.status(422).json({error:"please enter the field"})
    }
    User.findOne({email:email})
    .then(addUsr => {
        if(!addUsr){
            return res.status(422).json({error:"invalid email or password"})
        }
        bcrypt.compare(password,addUsr.password)
        .then(match =>{
            if(match){
                const token = jwt.sign({_id:addUsr._id},jwtSrc)
                const {_id,name,email,followers,following,pic} = addUsr
                res.json({token,user:{_id,name,email,followers,following,pic}})
            }
            //res.json({message:"sucessfully signed in"})
            else{
                console.log(match)
                return res.status(422).json({error:"invalid email or password error"})
            }
        })
        .catch(err =>{
            console.log(err)
        })
    })
})


module.exports = router