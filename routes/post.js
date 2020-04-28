const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');
const Post = mongoose.model('Post')
const reqAccess = require('../middleware/reqLogin')

router.post('/newPost',reqAccess,(req,res) => {
    const {title,body,pic} = req.body
    if(!title || !body || !pic){
        return res.status(422).json({error:"Please fill all the field"})
    }
    // console.log(req.user)
    // res.send("ok")
    req.user.password = undefined
    const post = new Post({
        title,
        body,
        photo:pic,
        postedBy:req.user
    
    })
    post.save().then(result => {
        res.json({post:result})
    })
    .catch(err =>{
        console.log(err)
    })
})


router.get('/allpost',reqAccess,(req,res) =>{
    Post.find()
    .populate('postedBy',"_id name")
    .then(allpost =>{
        res.json({allpost})
    })
    .catch(err =>{
        console.log(err)
    })
})


router.get("/myPost",reqAccess,(req,res) =>{
    Post.find({postedBy:req.user._id})
    .populate("postedBy","_id name")
    .then(mypost =>{
        res.json({mypost})
    })
    .catch(err =>{
        console.log(err)
    })
})

router.put('/like',reqAccess,(req,res) =>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:({likes:req.user._id})
    },{
        new:true
    }).exec((err,result) =>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.put('/unlike',reqAccess,(req,res) =>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:({likes:req.user._id})
    },{
        new:true
    }).exec((err,result) =>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})
module.exports = router