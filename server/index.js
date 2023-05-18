const express=require('express');
const app=express();
const multer=require('multer');
const Screenshot=require('./db/image');
require('./db/config');
const User=require("./db/User.js");
const Admin=require('./db/Admin.js');
const Score=require('./db/Score.js');
const cors=require('cors');
const Jwt=require('jsonwebtoken')
const jwtKey='e-com';
const mongoose=require('mongoose')
// const kurento = require('kurento-client');
// const uuid = require('uuid');






const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(cors());
app.use(express.json());


//ye audio ka schema hai
const audioSchema = new mongoose.Schema({
  name: String,
  data: Buffer,
  contentType: String
});
const Audio = mongoose.model('Audio', audioSchema);




//admin login
app.post('/adminlogin', async (req, res) => {
    const { email, password } = req.body;
    const user = await Admin.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    if (user.password !== password) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
   res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      password:user.password,
      phone:user.phone,
      address:user.address
    });
  });


//Admin registeration for user(test dene walo ka registration)
app.post("/register",async(req,res)=>{
   let user=new User(req.body)
   let result=await user.save();
   result=result.toObject();
   delete result.password;
   Jwt.sign({result},jwtKey,{expiresIn:"2h"},(err,token)=>{
    if(err){
     res.send({result:"something went to wrong"})
    }
    res.send({result,auth:token})
 })
});
 //get all data (test dene walo ka deta)
app.get('/getAllUsers',async(req,res)=>{
    let products=await User.find();
    if(products.length>0){
        res.send(products)
    }else{
        res.send({result:"no product found"})
    }
}) 



//test dene wala user login
app.post('/testuserlogin', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ error: 'Invalid email or password' });
  }
  if (user.password !== password) {
    return res.status(400).json({ error: 'Invalid email or password' });
  }
 res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    password:user.password,
    phone:user.phone,
    address:user.address
  });
});



//test dene k baad score save in database
app.post("/userscore",async(req,res)=>{
  let user=new Score(req.body)
  let result=await user.save();
  res.send({result})
});



//test dene wale ka score get k liye(score data get )
app.get('/getAllScore',async(req,res)=>{
  let products=await Score.find();
  if(products.length>0){
      res.send(products)
  }else{
      res.send({result:"no Score found"})
  }
}) 

//test submit k baad id delete k liye
app.delete('/user/:id',async(req,res)=>{
  let id=req.params.id;
  const result=await User.deleteOne({_id:id})
  res.send(result)
})

//yha test dene wale ka image save hoga
app.post('/screenshot', upload.single('screenshot'), async (req, res) => {
  try { 
    const screenshot = new Screenshot({ data: req.file.buffer });
    await screenshot.save();
    res.status(201).send('Screenshot saved successfully!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error saving screenshot to database');
  }
});


//yha pr test dene wale ka audio
app.post('/upload-audio', upload.single('audio'), async (req, res) => {
  try {
    const audio = new Audio({
      name: req.file.originalname,
      data: req.file.buffer,
      contentType: req.file.mimetype
    });

    await audio.save();
    res.json({ audioUrl: `http://localhost:8080/play-audio/${audio._id}` });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error saving audio to database');
  }
});


//live stream



app.listen(5000,()=>{
    console.log('server run 5000 port')
})