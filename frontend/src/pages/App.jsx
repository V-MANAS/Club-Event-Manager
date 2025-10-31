import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaUsers, FaSignInAlt } from "react-icons/fa";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-black text-gray-100 flex flex-col items-center justify-center px-6 relative">
      
      {/* 🔹 Floating Navigation Bar */}
      <nav className="fixed top-5 right-6 bg-gray-800/70 backdrop-blur-md px-6 py-2 rounded-full shadow-lg flex gap-6 text-sm z-50">
        <Link to="/clubs" className="hover:text-blue-400 transition">
          <FaUsers className="inline mr-1" /> Clubs
        </Link>
        <Link to="/events" className="hover:text-blue-400 transition">
          <FaCalendarAlt className="inline mr-1" /> Events
        </Link>
        <Link to="/login" className="hover:text-blue-400 transition">
          <FaSignInAlt className="inline mr-1" /> Login
        </Link>
      </nav>

      {/* Header */}
      <motion.h1
        className="text-5xl md:text-6xl font-extrabold mb-4 text-blue-400 tracking-tight mt-12"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Club Event Scheduler
      </motion.h1>

      <motion.p
        className="text-gray-400 text-center max-w-xl mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        A smart way to manage college clubs and upcoming events effortlessly. 
        Join, explore, and never miss a moment!
      </motion.p>

      {/* Navigation Buttons (you can keep this too if you want large buttons in center) */}
      <motion.nav
        className="flex flex-wrap justify-center gap-6 mb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <Link
          to="/clubs"
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-lg font-semibold shadow-lg transition-all"
        >
          <FaUsers /> Clubs
        </Link>

        <Link
          to="/events"
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-lg font-semibold shadow-lg transition-all"
        >
          <FaCalendarAlt /> Events
        </Link>

        <Link
          to="/login"
          className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl text-lg font-semibold shadow-lg transition-all"
        >
          <FaSignInAlt /> Login
        </Link>
      </motion.nav>

      {/* Feature Cards */}
      <motion.div
        className="grid md:grid-cols-3 gap-8 w-full max-w-5xl text-left"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="bg-gray-800 rounded-2xl p-6 shadow-xl hover:scale-105 transition">
          <h2 className="text-xl font-bold text-blue-400 mb-2">✨ Manage Clubs</h2>
          <p className="text-gray-400">
            Create, update, and manage your college clubs with ease.
          </p>
        </div>

        <div className="bg-gray-800 rounded-2xl p-6 shadow-xl hover:scale-105 transition">
          <h2 className="text-xl font-bold text-indigo-400 mb-2">📅 Plan Events</h2>
          <p className="text-gray-400">
            Schedule events and let members register instantly.
          </p>
        </div>

        <div className="bg-gray-800 rounded-2xl p-6 shadow-xl hover:scale-105 transition">
          <h2 className="text-xl font-bold text-emerald-400 mb-2">⭐ Get Feedback</h2>
          <p className="text-gray-400">
            Collect feedback from attendees to improve future events.
          </p>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="mt-16 text-gray-500 text-sm">
        © {new Date().getFullYear()} Club Event Scheduler. Built with ❤️ using MERN.
      </footer>
    </div>
  );
}
