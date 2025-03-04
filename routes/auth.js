const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const fetchuser = require('../middleware/fetchuser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET= 'JaiIsAGoodBoy';

//Route 1 create user and return authteken /api/auth/createuser
router.post('/createuser', [ 
  body('name', 'Enter a valid Name').isLength({ min : 3}),
  body('email', 'Enter a valid email').isEmail(),
  body('[password]', 'Password must be atleast 5 characters').isLength({ min : 5 })
 ] , async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
      return res.status(400).json({errors:errors.array()});
    }

    try
    {
    let user = await User.findOne({email : req.body.email});
    if(user){
      return res.status(400).json({error : "Sorry user with this email already exists"})
    }

    const salt = await  bcrypt.genSalt(10);
    secpass = await  bcrypt.hash(req.body.password,salt);
      user = await User.create({
      name : req.body.name,
      email : req.body.email,
      password : secpass,
    });
    const data = {
      user : {
        id : user.id
      }
    }
    const authToken = jwt.sign(data,JWT_SECRET);
    console.log(authToken);
    //return res.json(user);
    return res.json(authToken);
  }
  catch(error)
  {
    console.error(error.message);
    return res.status(500).json({error : "Some error occured!"})

  }
    // .then( user => res.json(user)).catch( err => console.log(err))
    // res.json({"error":"Please enter unique value for email"});
    // console.log(req.body);
    // const user = User(req.body);
    // user.save();
    // res.send("Hello");
})

// app.get('/api/v1/login', (req, res) => {
//   res.send('login!')
// })

// app.get('/api/v1/signup', (req, res) => {
//   res.send('Hello signup!')
// })

//Route 2 Login user via authtoken and return id /api/auth/login
router.post('/login', [ 
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'please enter correct credentials').exists()
 ] , async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
      return res.status(400).json({errors:errors.array()});
    }
    const {email , password} = req.body;
    try{
      let user = await User.findOne({email : req.body.email});
      if(!user){
        return res.status(400).json({error : "Sorry user with this email not exists"})
      }
      const passwordCompare = await bcrypt.compare(password,user.password);
      console.error(password);
      console.error(user.password);
      console.error(passwordCompare);
      if(!passwordCompare)
      {
        return res.status(400).json({error : "Sorry try to login with correct credentials"})
      }

      const payload = {
        user : {
          id : user.id
        }
      }
      const authToken = jwt.sign(payload,JWT_SECRET);
      res.json(authToken);
    }catch(error)
    {
      console.error(error.message);
      return res.status(500).json({error : "Some error occured!"})
    }
  
  })

  //Route 3 Getlogged in user detail /api/auth/getuser
  router.post('/getuser',fetchuser, async (req, res) => {
  
  
  try{
    let userId =req.user.id;
    let user = await User.findById((userId)).select("-password");
    res.json(user);
  }catch(error)
  {
    console.error(error.message);
    return res.status(500).json({error : "Some error occured!"})
  }
  
  
  })

module.exports = router