/**
 * Example cron job to find events within next 24 hours and print reminders.
 * In production replace console.log with email/SMS (Nodemailer/Twilio).
 */
const cron = require('node-cron');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const Event = require('./models/Event');

mongoose.connect(process.env.MONGO_URI);

cron.schedule('0 * * * *', async ()=>{ // every hour
  const now = new Date();
  const next24 = new Date(now.getTime() + 24*3600*1000);
  const events = await Event.find({ date: { $gte: now, $lte: next24 } }).populate('clubId');
  events.forEach(ev=>{
    console.log('Reminder - upcoming event:', ev.title, 'at', ev.date);
  });
});
