const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');
const Post = mongoose.model('Post')
const User = mongoose.model('User')
const reqAccess = require('../middleware/reqLogin')

router.get('/user/:id',reqAccess,(req,res)=>{
    User.findOne({_id:req.params.id})
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

router.put('/follow',reqAccess,(req,res) =>{
    User.findByIdAndUpdate(req.body.followId,{
        $push:{followers:req.user._id}
    },{
        new:true
    },(err,result) =>{
        if(err){
            return res.status(422).json({error:err})
        }

        User.findByIdAndUpdate(req.user._id,{
            $push:{following:req.body.followId}
        },{
            new:true
        }).select('-password')
        .then(result =>{
            res.json(result)
        }).catch(err =>{
            return res.status(422).json({error:err})
        })
    })
})

router.put('/unfollow',reqAccess,(req,res) =>{
    User.findByIdAndUpdate(req.body.unfollowId,{
        $pull:{followers:req.user._id}
    },{
        new:true
    },(err,result) =>{
        if(err){
            return res.status(422).json({error:err})
        }

        User.findByIdAndUpdate(req.user._id,{
            $pull:{following:req.body.unfollowId}
        },{
            new:true
        }).select('-password')
        .then(result =>{
            res.json(result)
        }).catch(err =>{
            return res.status(422).json({error:err})
        })
    })
})

router.put('/updatepic',reqAccess,(req,res) =>{
    User.findByIdAndUpdate(req.user._id,{$set:{pic:req.body.pic}},{new:true},
        (err,result) => {
            if(err){
                return res.status(422).json({error:'Pic cannot post'})
            }
            res.json(result)
        })
})


module.exports = router