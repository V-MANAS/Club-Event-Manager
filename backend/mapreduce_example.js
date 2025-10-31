/**
 * Example: MapReduce to calculate most active club by number of events.
 * Run within node (after connecting to DB), or adapt for scripts.
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const Event = require('./models/Event');

async function run(){
  await mongoose.connect(process.env.MONGO_URI);
  const o = {};
  o.map = function(){ emit(this.clubId.toString(), 1); };
  o.reduce = function(k, vals){ return Array.sum(vals); };
  o.out = { inline: 1 };
  const res = await Event.collection.mapReduce(o.map, o.reduce, { out: o.out });
  console.log(res);
  process.exit(0);
}

run();
