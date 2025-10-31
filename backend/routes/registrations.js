const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Registration = require('../models/Registration');

// register to event
router.post('/', auth, async (req,res)=>{
  try{
    const { eventId } = req.body;
    const reg = new Registration({ eventId, userId: req.user._id });
    await reg.save();
    res.json(reg);
  }catch(err){
    if(err.code === 11000) return res.status(400).json({message:'Already registered'});
    res.status(500).json({error:err.message});
  }
});

// my registrations
router.get('/me', auth, async (req,res)=>{
  const regs = await Registration.find({ userId: req.user._id }).populate('eventId');
  res.json(regs);
});

module.exports = router;
