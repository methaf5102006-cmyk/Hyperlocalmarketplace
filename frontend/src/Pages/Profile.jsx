import React, { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);

  // ================= FETCH PROFILE =================
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/providers/${id}`
        );
        setProfile(res.data);
      } catch (error) {
        console.log(error.message);
      }
    };

    if (id) fetchProfile();
  }, [id]);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  // ================= SAVE PROFILE =================
  const saveProfile = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/providers/${id}`,
        profile
      );

      // ✅ FIX: update localStorage so dashboard reflects changes
      const storedUser = JSON.parse(localStorage.getItem("user"));

      if (storedUser && storedUser._id === res.data.userId) {
        const updatedUser = {
          ...storedUser,
          name: res.data.name,
          image: res.data.image,
        };

        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      alert("Profile saved ✅");
      navigate(-1);
    } catch (err) {
      console.log(err.message);
      alert("Failed to save ❌");
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-white">
        Loading Profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] relative overflow-hidden py-10 px-4">

      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/20 blur-[120px] rounded-full"></div>

      <div className="relative z-10 max-w-5xl mx-auto">

        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">

          {/* TOP */}
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="w-28 h-28 rounded-3xl bg-blue-600 flex items-center justify-center text-white shadow-lg overflow-hidden">
              
              {profile?.image ? (
                <img
                  src={profile.image}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-5xl font-black">
                  {profile?.name?.charAt(0)?.toUpperCase() || "P"}
                </span>
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-4xl font-black text-white">
                {profile.name}
              </h1>
              <p className="text-blue-400 text-lg mt-1 capitalize">
                {profile.service}
              </p>
            </div>
          </div>

          {/* IMAGE */}
          <div className="mt-6">
            <label className="text-gray-400 text-sm">Profile Image URL</label>
            <input
              name="image"
              value={profile.image || ""}
              onChange={handleChange}
              className="w-full mt-2 p-3 rounded-xl bg-white/10 text-white border border-white/10"
            />
          </div>

          {/* FORM */}
          <div className="mt-10 grid md:grid-cols-2 gap-6">

            <div className="flex flex-col gap-1">
              <label className="text-gray-400 text-sm">Name</label>
              <input
                name="name"
                value={profile.name || ""}
                onChange={handleChange}
                className="p-3 rounded-xl bg-white/10 text-white border border-white/10"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-gray-400 text-sm">Phone</label>
              <input
                name="phone"
                value={profile.phone || ""}
                onChange={handleChange}
                className="p-3 rounded-xl bg-white/10 text-white border border-white/10"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-gray-400 text-sm">Experience</label>
              <input
                name="experience"
                value={profile.experience || ""}
                onChange={handleChange}
                className="p-3 rounded-xl bg-white/10 text-white border border-white/10"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-gray-400 text-sm">Price</label>
              <input
                name="price"
                value={profile.price || ""}
                onChange={handleChange}
                className="p-3 rounded-xl bg-white/10 text-white border border-white/10"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-gray-400 text-sm">Location</label>
              <input
                name="location"
                value={profile.location || ""}
                onChange={handleChange}
                className="p-3 rounded-xl bg-white/10 text-white border border-white/10"
              />
            </div>

          </div>

          {/* BIO */}
          <textarea
            name="bio"
            value={profile.bio || ""}
            onChange={handleChange}
            className="w-full mt-5 p-3 rounded-xl bg-white/10 text-white"
            rows="5"
          />

          {/* AVAILABILITY */}
          <div className="mt-5 flex items-center gap-4">
            <input
              type="checkbox"
              checked={profile.isAvailable || false}
              onChange={(e) =>
                setProfile({ ...profile, isAvailable: e.target.checked })
              }
            />
            <span className="text-white">Available</span>
          </div>

          {/* BUTTONS */}
          <div className="mt-8 flex gap-4">
            <button
              onClick={saveProfile}
              className="bg-blue-600 px-8 py-4 rounded-2xl text-white font-bold flex items-center gap-3"
            >
              <Save size={20} />
              Save Profile
            </button>

            <button
              onClick={() => navigate(-1)}
              className="bg-white/10 px-8 py-4 rounded-2xl text-white"
            >
              Cancel
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;