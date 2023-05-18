const mongoose=require('mongoose');

const userSchema1=new mongoose.Schema({
    name:{
        type:String,
    },
    email:{
        type:String,
    },
    address:{
        type:String,
        
    },
    phone:{
        type:String,
        
    },
    password:{
        type:String,
    },
    
});

module.exports=mongoose.model('users',userSchema1);