const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');
const Post = mongoose.model('Post')
const User = mongoose.model('User')
const reqAccess = require('../middleware/reqLogin')

router.get('user/:id',(req,res)=>{
    User.findOne({_id:req.params._id})
    .select('-password')
    .then(user =>{
        Post.find({postedBy:req.params.id})
        .populate('postedBy','_id name')
        .exec((err,posts)=>{
            if(err){
                return res.json(422).json({error:err})
            }
            res.json({user,posts})
        })
    }).catch(err =>{
        return res.status(404).json({err:'User not Found'})
    })
})

module.exports = router