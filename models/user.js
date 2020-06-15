const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    pic:{
        type:String,
        default:'https://res.cloudinary.com/ashish1221/image/upload/v1592221901/default-avatar-profile-vector-user-profile-default-avatar-profile-vector-user-profile-profile-179376714_qwolns.jpg'
    },
    followers:[{type:mongoose.Schema.Types.ObjectId, ref:"User"}],
    following:[{type:mongoose.Schema.Types.ObjectId, ref:"User"}]
})


const User = mongoose.model('User',userSchema);

