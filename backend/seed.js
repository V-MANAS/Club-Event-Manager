/**
 * Seed script to create admin, clubs, and events
 * Run: npm run seed
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import Club from "./models/Club.js";
import Event from "./models/Event.js";

dotenv.config();

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected to MongoDB");

  await User.deleteMany({});
  await Club.deleteMany({});
  await Event.deleteMany({});

  // Create admin user
  const hash = await bcrypt.hash("password", 10);
  const admin = await User.create({
    name: "Admin User",
    email: "admin@college.edu",
    password: hash,
    role: "admin",
  });

  // Create multiple clubs
  const clubsData = [
    { name: "GDSC", description: "Google Developer Student Club" },
    { name: "Coding Ninjas", description: "A club for coding lovers" },
    { name: "Robotics Society", description: "Build and program robots" },
    { name: "Music Club", description: "For musicians and singers" },
    { name: "Art & Creativity", description: "Paint, draw, and create" },
    { name: "Drama Club", description: "Stage acts and theatre" },
    { name: "Photography Club", description: "Capture your creativity" },
    { name: "Sports Club", description: "All about sports and fitness" },
  ];

  const clubs = [];
  for (const c of clubsData) {
    const newClub = await Club.create({
      ...c,
      createdBy: admin._id,
      members: [admin._id],
    });
    clubs.push(newClub);
    admin.clubsJoined.push(newClub._id);
  }
  await admin.save();

  // Create sample events (linked to random clubs)
  const eventsData = [
    { title: "Hackathon 2025", description: "24-hour coding challenge", location: "Lab 1" },
    { title: "Robotics Expo", description: "Show your bots!", location: "Hall B" },
    { title: "Music Fest", description: "Live performances", location: "Open Ground" },
    { title: "Art Exhibition", description: "Showcase creative artwork", location: "Auditorium" },
  ];

  for (const ev of eventsData) {
    const randomClub = clubs[Math.floor(Math.random() * clubs.length)];
    await Event.create({
      ...ev,
      clubId: randomClub._id,
      date: new Date(Date.now() + Math.random() * 10 * 24 * 3600 * 1000),
      createdBy: admin._id,
    });
  }

  console.log("✅ Database seeded successfully!");
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
