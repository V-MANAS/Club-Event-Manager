const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const Feedback = require('../models/Feedback');

/* -----------------------------------------------------
   🧩 Create Event (CREATE)
----------------------------------------------------- */
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, date, location, clubId } = req.body;

    if (!title || !date || !clubId)
      return res.status(400).json({ message: "Title, Date, and Club are required" });

    const event = new Event({
      title,
      description,
      date,
      location,
      clubId,
      createdBy: req.user._id,
    });

    await event.save();
    res.status(201).json({ message: "Event created successfully", event });
  } catch (err) {
    console.error("Error creating event:", err);
    res.status(500).json({ error: err.message });
  }
});

/* -----------------------------------------------------
   ✏️ Edit Event (UPDATE)
----------------------------------------------------- */
router.put('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Only creator/admin can edit
    if (event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this event' });
    }

    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: 'Event updated successfully', updatedEvent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* -----------------------------------------------------
   🗑 Delete Event (DELETE)
----------------------------------------------------- */
router.delete('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Only creator/admin can delete
    if (event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }

    await Event.findByIdAndDelete(req.params.id);
    await Registration.deleteMany({ eventId: req.params.id });
    await Feedback.deleteMany({ eventId: req.params.id });

    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* -----------------------------------------------------
   🔍 List + Search + Filter + Sort (READ)
----------------------------------------------------- */
router.get('/', async (req, res) => {
  try {
    const { search, clubId, sort } = req.query;
    let query = {};

    if (search) {
      // Text search for title or description
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (clubId) query.clubId = clubId;

    let sortOption = {};
    if (sort === 'latest') sortOption.date = -1;
    else if (sort === 'oldest') sortOption.date = 1;

    const events = await Event.find(query)
      .populate('clubId', 'name')
      .sort(sortOption)
      .limit(100);

    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* -----------------------------------------------------
   📊 Event Details with Aggregation (READ ONE)
----------------------------------------------------- */
router.get('/:id', async (req, res) => {
  try {
    const ev = await Event.findById(req.params.id).populate('clubId', 'name');
    if (!ev) return res.status(404).json({ message: 'Event not found' });

    const regCount = await Registration.countDocuments({ eventId: ev._id });
    const avgRatingAgg = await Feedback.aggregate([
      { $match: { eventId: ev._id } },
      { $group: { _id: "$eventId", avgRating: { $avg: "$rating" } } },
    ]);

    const avgRating = avgRatingAgg[0]?.avgRating || null;
    res.json({ event: ev, registrations: regCount, avgRating });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* -----------------------------------------------------
   📈 Aggregation: Registrations per Event
----------------------------------------------------- */
router.get('/stats/registrations-per-event', async (req, res) => {
  try {
    const agg = await Registration.aggregate([
      { $group: { _id: "$eventId", totalRegistrations: { $sum: 1 } } },
      {
        $lookup: {
          from: "events",
          localField: "_id",
          foreignField: "_id",
          as: "eventDetails",
        },
      },
      { $unwind: "$eventDetails" },
      {
        $project: {
          eventTitle: "$eventDetails.title",
          totalRegistrations: 1,
        },
      },
      { $sort: { totalRegistrations: -1 } },
    ]);

    res.json(agg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* -----------------------------------------------------
   ⚙️ DBMS Optimization: Indexing
----------------------------------------------------- */
Event.collection.createIndex({ title: "text", description: "text", date: 1 });

module.exports = router;
