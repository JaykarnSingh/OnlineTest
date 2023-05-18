const mongoose=require('mongoose');

const userSchema2=new mongoose.Schema({
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

module.exports=mongoose.model('admins',userSchema2);