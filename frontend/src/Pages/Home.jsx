import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Leaflet
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// ✅ ADDED ICONS
import { Zap, Wrench } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const res = await fetch("/api/serviceproviders");
        const data = await res.json();
        setProviders(data);
      } catch (err) {
        console.error("Failed to fetch service providers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, []);

  return (
    <div className="bg-[#f8fafc] min-h-screen">

      {/* ================= HERO ================= */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">

        <img
          src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
          alt="hero"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/70"></div>

        <div className="relative z-10 text-center px-6 max-w-4xl">

          <p className="uppercase tracking-[4px] text-blue-400 font-semibold mb-4">
            Hyperlocal Skill Marketplace
          </p>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white">
            Hire Trusted <span className="text-blue-500">Electricians</span> & Plumbers
          </h1>

          <p className="mt-6 text-gray-300">
            Fast • Verified • Affordable Home Services Near You
          </p>

          <div className="mt-10 flex flex-col md:flex-row gap-4 justify-center">

            <button onClick={() => navigate("/login")}
              className="bg-white text-black px-8 py-4 rounded-2xl font-semibold">
              Login
            </button>

            <button onClick={() => navigate("/register")}
              className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-semibold">
              Sign Up
            </button>

            <button onClick={() => navigate("/services")}
              className="bg-green-500 text-white px-8 py-4 rounded-2xl font-semibold">
              Explore Services
            </button>

          </div>

        </div>
      </section>

      {/* ================= ONE LINE ================= */}
      <section className="py-14 px-6 bg-gray-900 text-center">

        <h2 className="text-4xl font-black text-white">
          Find Reliable Home Service Experts
        </h2>

        <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
          Book verified electricians and plumbers with fast response and affordable pricing.
        </p>

      </section>

      {/* ================= SERVICE PROVIDERS ================= */}
      <section className="pt-16 pb-6 px-6 bg-gray-900">

        <div className="max-w-6xl mx-auto text-center mb-10">

          <p className="text-blue-400 uppercase tracking-[3px] mb-3">
            Our Experts
          </p>

          <h2 className="text-4xl font-black text-white">
            Meet Our Service Providers
          </h2>

        </div>

        {loading && (
          <p className="text-center text-gray-400">Loading...</p>
        )}

        {!loading && providers.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

            {providers.map((provider) => {
              const isElectrician = provider.service === "electrician";

              const defaultImg = isElectrician
                ? "https://cdn-icons-png.flaticon.com/512/2933/2933827.png"
                : "https://cdn-icons-png.flaticon.com/512/3050/3050525.png";

              return (
                <div
                  key={provider._id}
                  className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden text-center"
                >

                  <div className={`h-2 w-full ${isElectrician ? "bg-blue-500" : "bg-green-500"}`}></div>

                  <div className="p-6">

                    <div className="w-20 h-20 mx-auto rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">

                      <img
                        src={provider.image && provider.image.trim() !== "" ? provider.image : defaultImg}
                        alt={provider.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = defaultImg;
                        }}
                      />

                    </div>

                    <h3 className="text-white font-bold mt-3">{provider.name}</h3>

                    <p className={`text-xs mt-2 ${isElectrician ? "text-blue-400" : "text-green-400"}`}>
                      {provider.service}
                    </p>

                    <p className="text-gray-400 text-sm mt-1">
                      📍 {provider.location}
                    </p>

                    <p className="text-yellow-400 font-bold">
                      ★ {provider.rating}
                    </p>

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </section>

      {/* ================= MAP ================= */}
      <section className="py-12 px-6 bg-gray-900 text-center">

        <h2 className="text-3xl font-black text-white mb-6">
          Find Services Near You
        </h2>

        <p className="text-gray-400 mb-8">
          Locate electricians and plumbers instantly
        </p>

        <div className="max-w-6xl mx-auto">

          <MapContainer
            center={[30.3753, 69.3451]}
            zoom={6}
            style={{ height: "350px", width: "100%", borderRadius: "20px" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            <Marker position={[30.3753, 69.3451]}>
              <Popup>Pakistan Service Area</Popup>
            </Marker>

          </MapContainer>

        </div>

      </section>

      {/* ================= AVAILABLE SERVICES ================= */}
      <section className="py-10 px-6 bg-gray-900">

        <div className="text-center mb-10">

          <h2 className="text-4xl font-black text-white">
            Available <span className="text-blue-400">Services</span>
          </h2>

        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">

          {/* ELECTRICIAN */}
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 text-center">

            <div className="w-24 h-24 mx-auto rounded-full bg-blue-500/20 flex items-center justify-center">
              <Zap size={50} className="text-blue-400" />
            </div>

            <h3 className="text-white text-2xl font-bold mt-4">
              Electrician Services
            </h3>

            <p className="text-gray-400 mt-4 mb-6">
              Professional electrical installation, maintenance, repair, wiring and troubleshooting services for homes and offices.
            </p>

            <button
              onClick={() => navigate("/services/electrician")}
              className="bg-blue-500 text-white px-6 py-3 rounded-xl"
            >
              Explore Service
            </button>

          </div>

          {/* PLUMBER */}
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 text-center">

            <div className="w-24 h-24 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
              <Wrench size={50} className="text-green-400" />
            </div>

            <h3 className="text-white text-2xl font-bold mt-4">
              Plumbing Services
            </h3>

            <p className="text-gray-400 mt-4 mb-6">
              Expert plumbing solutions including leakage fixing, pipe installation, bathroom fittings and maintenance.
            </p>

            <button
              onClick={() => navigate("/services/plumber")}
              className="bg-green-500 text-white px-6 py-3 rounded-xl"
            >
              Explore Service
            </button>

          </div>

        </div>

      </section>

    </div>
  );
};

export default Home;