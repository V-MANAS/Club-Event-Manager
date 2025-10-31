const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Club = require('../models/Club');
const User = require('../models/User');

// create club
router.post('/', auth, async (req,res)=>{
  try{
    const { name, description } = req.body;
    const club = new Club({ name, description, createdBy: req.user._id, members: [req.user._id] });
    await club.save();
    // add to user's clubsJoined
    req.user.clubsJoined.push(club._id);
    await req.user.save();
    res.json(club);
  }catch(err){ res.status(500).json({error:err.message}); }
});

// list clubs
router.get('/', async (req,res)=>{
  const clubs = await Club.find().populate('createdBy','name email').limit(100);
  res.json(clubs);
});

// add/remove member
router.post('/:id/join', auth, async (req,res)=>{
  const club = await Club.findById(req.params.id);
  if(!club) return res.status(404).json({message:'Club not found'});
  if(club.members.includes(req.user._id)) return res.status(400).json({message:'Already member'});
  club.members.push(req.user._id);
  await club.save();
  req.user.clubsJoined.push(club._id);
  await req.user.save();
  res.json({message:'Joined', club});
});

router.post('/:id/leave', auth, async (req,res)=>{
  const club = await Club.findById(req.params.id);
  if(!club) return res.status(404).json({message:'Club not found'});
  club.members = club.members.filter(m => m.toString() !== req.user._id.toString());
  await club.save();
  req.user.clubsJoined = req.user.clubsJoined.filter(c => c.toString() !== req.params.id);
  await req.user.save();
  res.json({message:'Left', club});
});

// delete club
router.delete('/:id', auth, async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ message: 'Club not found' });

    // only the creator/admin can delete it
    if (club.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this club' });
    }

    await Club.findByIdAndDelete(req.params.id);

    // remove club reference from all members
    await User.updateMany(
      { clubsJoined: club._id },
      { $pull: { clubsJoined: club._id } }
    );

    res.json({ message: 'Club deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// aggregation: total members per club
router.get('/stats/members-per-club', async (req,res)=>{
  const agg = await Club.aggregate([
    { $project: { name:1, membersCount: { $size: "$members" } } },
    { $sort: { membersCount: -1 } }
  ]);
  res.json(agg);
});

module.exports = router;
