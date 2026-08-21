import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";

const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) navigate("/admin-login");
  }, [navigate]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users");
        setUsers(res.data);
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchUsers();
  }, []);

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className="p-8 bg-[#0f172a] min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">Users</h1>

      {users.map((u) => (
        <div key={u._id} className="bg-[#1e293b] p-4 mb-3 rounded-xl flex justify-between">
          <div>
            <p>{u.name}</p>
            <p className="text-gray-400">{u.email}</p>
          </div>

          <button onClick={() => deleteUser(u._id)}>
            <Trash2 className="text-red-500" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default AdminUsers;