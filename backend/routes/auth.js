const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// register
router.post('/register', async (req, res)=>{
  try{
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if(user) return res.status(400).json({message:'User exists'});
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    user = new User({ name, email, password: hash });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token, user: { id:user._id, name:user.name, email:user.email }});
  }catch(err){ res.status(500).json({error: err.message}); }
});

// login
router.post('/login', async (req,res)=>{
  try{
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if(!user) return res.status(400).json({message:'Invalid creds'});
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) return res.status(400).json({message:'Invalid creds'});
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token, user: { id:user._id, name:user.name, email:user.email }});
  }catch(err){ res.status(500).json({error: err.message}); }
});

module.exports = router;
