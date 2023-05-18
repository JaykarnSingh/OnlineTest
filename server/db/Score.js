const mongoose=require('mongoose');

const userSchema2=new mongoose.Schema({
    length:{
        type:Number,
    },
    score:{
        type:Number,
    },
    cans:{
        type:Number,
        
    },
    wans:{
        type:Number,
        
    },
    id:{
        type:String,
    },
    
    
    
},
{ 
     timestamps:true
}

);

module.exports=mongoose.model('scores',userSchema2);