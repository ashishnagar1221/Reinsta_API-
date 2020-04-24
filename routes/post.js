const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');
const Post = mongoose.model('Post')
const reqAccess = require('../middleware/reqLogin')

router.post('/newPost',reqAccess,(req,res) => {
    const {title,body} = req.body
    if(!title || !body){
        return res.status(422).json({error:"Please fill all the field"})
    }
    // console.log(req.user)
    // res.send("ok")
    req.user.password = undefined
    const post = new Post({
        title,
        body,
        postedBy:req.user
    
    })
    post.save().then(result => {
        res.json({post:result})
    })
    .catch(err =>{
        console.log(err)
    })
})


router.get('/allpost',(req,res) =>{
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
        res.json(mypost)
    })
    .catch(err =>{
        console.log(err)
    })
})
module.exports = router