import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ServiceProviders = () => {
  const navigate = useNavigate();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/providers");
        const data = await res.json();
        setProviders(data);
      } catch (err) {
        console.error("Failed to fetch providers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-gray-400 text-lg">Loading providers...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-16 px-6">
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-14">
          <p className="uppercase tracking-[3px] text-blue-400 font-semibold mb-3">
            Our Experts
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-white">
            Meet Our <span className="text-blue-400">Service Providers</span>
          </h2>
          <div className="w-28 h-1.5 bg-blue-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {providers.length === 0 ? (
          <p className="text-center text-gray-400 text-lg">No providers found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {providers.map((provider) => {
              const isElectrician = provider.service === "electrician";

              return (
                <div
                  key={provider._id}
                  className="group bg-gray-800 border border-gray-700 rounded-[24px] shadow-md hover:shadow-2xl transition duration-300 overflow-hidden text-center"
                >
                  <div className={`h-2 w-full ${isElectrician ? "bg-blue-500" : "bg-green-500"}`}></div>

                  <div className="p-7">

                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition duration-300 overflow-hidden ${isElectrician ? "bg-blue-900" : "bg-green-900"}`}>
                      {provider.image ? (
                        <img
                          src={`http://localhost:5000${provider.image}`}
                          alt={provider.name}
                          className="w-20 h-20 object-cover rounded-full"
                        />
                      ) : (
                        <img
                          src={
                            isElectrician
                              ? "https://cdn-icons-png.flaticon.com/512/2933/2933827.png"
                              : "https://cdn-icons-png.flaticon.com/512/3050/3050525.png"
                          }
                          alt={provider.service}
                          className="w-12 h-12"
                        />
                      )}
                    </div>

                    <h3 className="text-lg font-black text-white">{provider.name}</h3>

                    <div className={`inline-flex items-center gap-1 mt-1 mb-2 px-3 py-1 rounded-full text-xs font-semibold capitalize ${isElectrician ? "bg-blue-900 text-blue-400" : "bg-green-900 text-green-400"}`}>
                      {provider.service}
                    </div>

                    <p className="text-gray-400 text-sm mb-1">📍 {provider.location}</p>
                    <p className="text-gray-300 text-sm font-semibold mb-2">Rs. {provider.price} / visit</p>

                    <div className="flex items-center justify-center gap-1 mb-2">
                      <span className="text-yellow-400 font-black text-sm">★ {provider.rating}</span>
                    </div>

                    <p className={`text-xs font-semibold mb-5 ${provider.isAvailable ? "text-green-400" : "text-red-400"}`}>
                      {provider.isAvailable ? "✔ Available" : "✘ Not Available"}
                    </p>

                    <button
                      onClick={() => navigate(`/providers/${provider._id}`)}
                      className={`w-full py-2.5 rounded-xl font-semibold text-white text-sm transition ${isElectrician ? "bg-blue-500 hover:bg-blue-600" : "bg-green-500 hover:bg-green-600"}`}
                    >
                      View Profile
                    </button>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default ServiceProviders;