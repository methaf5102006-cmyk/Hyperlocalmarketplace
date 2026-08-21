import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import {
  Search,
  MapPin,
  Star,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

const ServicesPage = () => {
  const navigate = useNavigate();
  const { type } = useParams();

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [providers, setProviders] = useState([]);

  // ================= FETCH PROVIDERS =================
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/providers",
          {
            params: {
              service: search,
              location: location,
              maxPrice: maxPrice,
            },
          }
        );

        setProviders(res.data || []);
      } catch (error) {
        console.log(error);
        setProviders([]);
      }
    };

    fetchProviders();
  }, [search, location, maxPrice]);

  // ================= FILTER LOGIC =================
  const filteredProviders = providers.filter((p) => {
    const matchType = type
      ? p.service?.toLowerCase().trim() === type.toLowerCase().trim()
      : true;

    const matchLocation = location
      ? p.location?.toLowerCase().includes(location.toLowerCase())
      : true;

    const matchPrice = maxPrice
      ? Number(p.price) <= Number(maxPrice)
      : true;

    return matchType && matchLocation && matchPrice;
  });

  return (
    <div className="min-h-screen bg-[#0f172a] text-white overflow-hidden">

      {/* HERO */}
      <section className="relative py-24 px-6 overflow-hidden">

        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/20 blur-[120px] rounded-full"></div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">

          <p className="uppercase tracking-[4px] text-blue-400 font-semibold mb-4">
            SkillLink Marketplace
          </p>

          <h1 className="text-5xl md:text-6xl font-black leading-tight">
            Find Trusted{" "}
            <span className="text-blue-500">Professionals</span>
          </h1>

          <p className="mt-6 text-gray-300 max-w-2xl mx-auto text-lg">
            Hire verified electricians and plumbers near you
          </p>

          {/* SEARCH */}
          <div className="mt-10 max-w-2xl mx-auto bg-white rounded-2xl p-2 flex items-center overflow-hidden shadow-2xl">

            <div className="px-3 text-gray-500">
              <Search size={22} />
            </div>

            <input
              type="text"
              placeholder="Search electrician or plumber..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 py-4 text-black outline-none"
            />

          </div>

          {/* FILTERS */}
          <div className="mt-6 max-w-2xl mx-auto grid grid-cols-2 gap-3">

            <input
              type="text"
              placeholder="Filter by location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="p-3 rounded-xl text-black outline-none"
            />

            <input
              type="number"
              placeholder="Max price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="p-3 rounded-xl text-black outline-none"
            />

          </div>

        </div>

      </section>

      {/* PROVIDERS */}
      <section className="px-6 pb-24">

        <div className="max-w-7xl mx-auto">

          <div className="flex justify-between items-center mb-10">

            <div>
              <h2 className="text-3xl font-bold">
                Available Professionals
              </h2>

              <p className="text-gray-400 mt-2">
                {filteredProviders.length} experts available
              </p>
            </div>

          </div>

          {/* CARDS */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            {filteredProviders.map((s) => (
              <div
                key={s._id || Math.random()}
                className="group bg-[#1e293b] border border-white/5 rounded-3xl overflow-hidden hover:border-blue-500/40 hover:-translate-y-2 transition duration-300 shadow-xl"
              >

                <div className="overflow-hidden relative">

                  <img
                    src={
                      s.image ||
                      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
                    }
                    alt={s.name}
                    className="h-60 w-full object-cover group-hover:scale-110 transition duration-500"
                  />

                  <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1">
                    <ShieldCheck size={14} />
                    Verified
                  </div>

                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    <Star size={14} className="text-yellow-400" />
                    4.9
                  </div>

                </div>

                <div className="p-6">

                  <h2 className="text-2xl font-bold">{s.name}</h2>

                  <p className="text-blue-400 mt-1 capitalize">
                    {s.service}
                  </p>

                  <div className="flex items-center gap-2 mt-4 text-gray-400">
                    <MapPin size={18} />
                    <p>{s.location}</p>
                  </div>

                  <div className="mt-6">
                    <p className="text-gray-400 text-sm">
                      Starting From
                    </p>

                    <h3 className="text-3xl font-black text-green-400">
                      Rs {s.price}
                    </h3>
                  </div>

                  {/* BUTTON */}
                  <button
                    onClick={() => {
                      if (s._id) {
                        navigate(`/providers/${s._id}`);
                      } else {
                        alert("Provider ID missing");
                      }
                    }}
                    className="mt-6 w-full bg-blue-600 hover:bg-blue-700 transition py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
                  >
                    View Profile
                    <ArrowRight size={18} />
                  </button>

                </div>

              </div>
            ))}

          </div>

        </div>

      </section>

    </div>
  );
};

export default ServicesPage;