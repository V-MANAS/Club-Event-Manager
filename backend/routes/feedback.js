const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Feedback = require('../models/Feedback');

// submit feedback
router.post('/', auth, async (req,res)=>{
  const { eventId, rating, comment } = req.body;
  const fb = new Feedback({ eventId, userId: req.user._id, rating, comment });
  await fb.save();
  res.json(fb);
});

// get feedback for event
router.get('/event/:id', async (req,res)=>{
  const f = await Feedback.find({ eventId: req.params.id }).populate('userId','name');
  res.json(f);
});

module.exports = router;
