import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminProviders = () => {
  const navigate = useNavigate();
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    if (!localStorage.getItem("adminToken")) {
      navigate("/admin-login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get("http://localhost:5000/api/providers");
      setProviders(res.data);
    };
    fetch();
  }, []);

  const approve = async (id) => {
    await axios.put(`http://localhost:5000/api/providers/approve/${id}`);
  };

  return (
    <div className="p-8 bg-[#0f172a] text-white min-h-screen">
      <h1 className="text-3xl mb-6">Providers</h1>

      {providers.map((p) => (
        <div key={p._id} className="bg-[#1e293b] p-4 mb-3 rounded-xl flex justify-between">
          <div>
            <p>{p.name}</p>
            <p className="text-gray-400">{p.email}</p>
          </div>

          <button onClick={() => approve(p._id)} className="text-green-400">
            Approve
          </button>
        </div>
      ))}
    </div>
  );
};

export default AdminProviders;