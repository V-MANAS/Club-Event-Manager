import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaUsers, FaTrashAlt, FaPlus } from "react-icons/fa";

export default function Clubs() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newClub, setNewClub] = useState({ name: "", description: "" });

  // Fetch all clubs
  const fetchClubs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/clubs");
      setClubs(res.data);
    } catch (err) {
      console.error("Error fetching clubs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  // ✅ Add new club
  const handleAddClub = async (e) => {
    e.preventDefault();
    if (!newClub.name || !newClub.description) {
      alert("Please fill all fields!");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/clubs",
        newClub,
        { headers: { Authorization: "Bearer " + token } }
      );
      setClubs([...clubs, res.data]);
      setNewClub({ name: "", description: "" });
      alert("🎉 Club added successfully!");
    } catch (err) {
      console.error("Error adding club:", err);
      alert(err.response?.data?.message || "Failed to add club");
    }
  };

  // 🗑 Delete club
  const handleDeleteClub = async (id) => {
    if (!window.confirm("Are you sure you want to delete this club?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/clubs/${id}`, {
        headers: { Authorization: "Bearer " + token },
      });
      // ✅ Remove from UI
      setClubs(clubs.filter((c) => c._id !== id));
      alert("🗑 Club deleted successfully!");
    } catch (err) {
      console.error("Error deleting club:", err);
      alert(err.response?.data?.message || "Failed to delete club");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-black text-gray-100 flex flex-col items-center py-12 px-6">
      {/* Header */}
      <motion.h2
        className="text-4xl md:text-5xl font-extrabold mb-8 text-blue-400 tracking-tight flex items-center gap-3"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <FaUsers className="text-blue-500" /> Clubs
      </motion.h2>

      {/* Club List */}
      {loading ? (
        <p className="text-gray-400 text-lg">Loading clubs...</p>
      ) : clubs.length > 0 ? (
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl mb-10"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {clubs.map((c) => (
            <motion.div
              key={c._id}
              className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700 hover:border-blue-500 hover:shadow-blue-500/30 transition-transform transform hover:scale-105 relative"
              whileHover={{ y: -5 }}
            >
              <h3 className="text-2xl font-bold text-blue-400 mb-2">{c.name}</h3>
              <p className="text-gray-400 mb-4">{c.description}</p>
              <p className="text-sm text-gray-500">
                Created by:{" "}
                <span className="text-gray-300">
                  {c.createdBy?.name || "Unknown"}
                </span>
              </p>

              {/* Delete Button */}
              <button
                onClick={() => handleDeleteClub(c._id)}
                className="absolute top-4 right-4 text-red-500 hover:text-red-400"
                title="Delete Club"
              >
                <FaTrashAlt />
              </button>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <p className="text-gray-400">No clubs available yet 💡</p>
      )}

      {/* ✅ Add Club Form moved BELOW */}
      <motion.form
        onSubmit={handleAddClub}
        className="bg-gray-800 rounded-2xl p-6 mt-6 shadow-lg border border-gray-700 w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h3 className="text-lg font-bold text-blue-400 mb-4 flex items-center gap-2">
          <FaPlus /> Add New Club
        </h3>

        <input
          type="text"
          placeholder="Club Name"
          value={newClub.name}
          onChange={(e) => setNewClub({ ...newClub, name: e.target.value })}
          className="w-full p-2 mb-3 rounded-md bg-gray-700 border border-gray-600 text-white"
        />
        <textarea
          placeholder="Description"
          value={newClub.description}
          onChange={(e) =>
            setNewClub({ ...newClub, description: e.target.value })
          }
          className="w-full p-2 mb-4 rounded-md bg-gray-700 border border-gray-600 text-white"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg font-semibold transition-all"
        >
          Add Club
        </button>
      </motion.form>
    </div>
  );
}
