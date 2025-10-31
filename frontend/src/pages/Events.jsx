import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaTrash, FaEdit, FaPlus } from "react-icons/fa";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    clubId: "",
  });
  const [editingEvent, setEditingEvent] = useState(null);
  const [userId, setUserId] = useState(null);

  // Fetch events from API
  async function fetchEvents() {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/events", {
        params: { search, sort },
      });
      setEvents(res.data);
    } catch (err) {
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEvents();
    const tokenData = JSON.parse(atob(localStorage.getItem("token")?.split(".")[1] || "null"));
    if (tokenData) setUserId(tokenData.id);
  }, [search, sort]);

  // Create or Update Event
  async function handleSubmit(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return alert("Please log in to create or edit events.");

    try {
      if (editingEvent) {
        await axios.put(`http://localhost:5000/api/events/${editingEvent._id}`, newEvent, {
          headers: { Authorization: "Bearer " + token },
        });
        alert("✅ Event updated successfully!");
      } else {
        await axios.post("http://localhost:5000/api/events", newEvent, {
          headers: { Authorization: "Bearer " + token },
        });
        alert("🎉 Event created successfully!");
      }
      setNewEvent({ title: "", description: "", date: "", location: "", clubId: "" });
      setEditingEvent(null);
      fetchEvents();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  }

  // Delete Event
  async function handleDelete(id) {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please log in to delete events.");
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/events/${id}`, {
        headers: { Authorization: "Bearer " + token },
      });
      alert("🗑 Event deleted successfully!");
      fetchEvents();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  }

  // Register for Event
  async function register(id) {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "http://localhost:5000/api/registrations",
        { eventId: id },
        { headers: { Authorization: "Bearer " + token } }
      );
      alert("🎉 Registered successfully!");
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  }

  // Edit Event Handler
  const handleEdit = (event) => {
    setEditingEvent(event);
    setNewEvent({
      title: event.title,
      description: event.description,
      date: new Date(event.date).toISOString().slice(0, 16),
      location: event.location,
      clubId: event.clubId?._id || "",
    });
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-black text-gray-100 flex flex-col items-center py-12 px-6">
      {/* Header */}
      <motion.h2
        className="text-4xl md:text-5xl font-extrabold mb-8 text-blue-400 tracking-tight flex items-center gap-3"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <FaCalendarAlt className="text-blue-500" /> Events
      </motion.h2>

      {/* Search & Sort */}
      <div className="flex flex-col md:flex-row gap-4 mb-10 w-full max-w-4xl">
        <input
          type="text"
          placeholder="🔍 Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-200"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-200"
        >
          <option value="latest">Sort by Latest</option>
          <option value="oldest">Sort by Oldest</option>
        </select>
      </div>

      {/* Event Cards */}
      {loading ? (
        <p className="text-gray-400">Loading events...</p>
      ) : events.length > 0 ? (
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {events.map((e) => (
            <motion.div
              key={e._id}
              className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700 hover:border-blue-500 hover:shadow-blue-500/30 transition-transform transform hover:scale-105"
            >
              <h3 className="text-2xl font-bold text-blue-400 mb-2">{e.title}</h3>
              <p className="text-gray-400 mb-3">{e.description || "No description."}</p>
              <p className="text-gray-500 mb-2 text-sm">📍 {e.location}</p>
              <p className="text-gray-400 text-sm">🗓 {new Date(e.date).toLocaleString()}</p>
              <p className="text-gray-400 text-sm mt-1">
                🏛 Club:{" "}
                <span className="text-indigo-400 font-medium">{e.clubId?.name || "Unassigned"}</span>
              </p>

              <div className="mt-4 flex gap-2 flex-wrap">
                <button
                  onClick={() => register(e._id)}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Register
                </button>

                {userId && e.createdBy === userId && (
                  <>
                    <button
                      onClick={() => handleEdit(e)}
                      className="bg-yellow-500 hover:bg-yellow-400 text-white px-3 py-2 rounded-lg text-sm flex items-center gap-2"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(e._id)}
                      className="bg-red-600 hover:bg-red-500 text-white px-3 py-2 rounded-lg text-sm flex items-center gap-2"
                    >
                      <FaTrash /> Delete
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <p className="text-gray-400 mt-8">No events found.</p>
      )}

      {/* Add/Edit Event Form */}
      <div className="mt-16 w-full max-w-2xl bg-gray-800 rounded-xl p-8 border border-gray-700 shadow-lg">
        <h3 className="text-2xl font-bold mb-4 text-blue-400 flex items-center gap-2">
          <FaPlus /> {editingEvent ? "Edit Event" : "Add New Event"}
        </h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Event Title"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            className="px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600"
            required
          />
          <textarea
            placeholder="Description"
            value={newEvent.description}
            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            className="px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600"
          />
          <input
            type="datetime-local"
            value={newEvent.date}
            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
            className="px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600"
            required
          />
          <input
            type="text"
            placeholder="Location"
            value={newEvent.location}
            onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
            className="px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600"
          />
          <input
            type="text"
            placeholder="Club ID"
            value={newEvent.clubId}
            onChange={(e) => setNewEvent({ ...newEvent, clubId: e.target.value })}
            className="px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600"
            required
          />

          <button
            type="submit"
            className="mt-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold transition-all"
          >
            {editingEvent ? "Update Event" : "Add Event"}
          </button>
        </form>
      </div>
    </div>
  );
}
