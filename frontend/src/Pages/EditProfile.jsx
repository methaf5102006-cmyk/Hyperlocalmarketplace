// import React, { useState } from "react";

const EditProfile = () => {
  // const [form, setForm] = useState({
  //   bio: "",
  //   phone: "",
  //   skills: "",
  //   hourlyRate: "",
  //   address: "",
  // });

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow">

        <h2 className="text-xl font-bold mb-4">✏️ Edit Profile</h2>

        <input className="border w-full p-2 mb-3" placeholder="Phone" />
        <input className="border w-full p-2 mb-3" placeholder="Skills" />
        <input className="border w-full p-2 mb-3" placeholder="Hourly Rate" />

        <textarea className="border w-full p-2 mb-3" placeholder="Bio" />

        <input className="border w-full p-2 mb-3" placeholder="Full Address (required)" />

        <button className="bg-green-600 text-white px-4 py-2 rounded">
          Update Profile
        </button>

      </div>
    </div>
  );
};

export default EditProfile;