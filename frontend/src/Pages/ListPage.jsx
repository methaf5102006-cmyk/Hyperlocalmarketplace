import React from "react";
import services from "../data/services";
import { useNavigate } from "react-router-dom";

const ListPage = () => {
  const navigate = useNavigate();

  const filtered = services.filter(
    (s) =>
      s.category.toLowerCase() === "electrician" ||
      s.category.toLowerCase() === "plumber"
  );

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <div className="bg-white py-10 text-center shadow-sm">

        <h1 className="text-3xl font-bold text-gray-800">
          Available Professionals
        </h1>

        <p className="text-gray-500 mt-2">
          Electricians & Plumbers Near You
        </p>

      </div>

      {/* GRID */}
      <div className="max-w-6xl mx-auto px-6 py-12">

        <div className="grid md:grid-cols-3 gap-8">

          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden"
            >

              {/* IMAGE */}
              <img
                src={item.image}
                alt={item.name}
                className="h-44 w-full object-cover"
              />

              {/* CONTENT */}
              <div className="p-5">

                <h3 className="text-lg font-bold text-gray-800">
                  {item.name}
                </h3>

                <p className="text-gray-500">
                  {item.category}
                </p>

                <p className="text-gray-500">
                  📍 {item.location}
                </p>

                <p className="text-blue-600 font-bold mt-2">
                  Rs {item.price}
                </p>

                {/* BUTTON */}
                <button
                  onClick={() => navigate(`/service/${item.id}`)}
                  className="mt-4 w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
                >
                  View Details
                </button>

              </div>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
};

export default ListPage;