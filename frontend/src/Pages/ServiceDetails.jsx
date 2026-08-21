import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import services from "../data/services";

// Leaflet imports
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ================= FIX LEAFLET DEFAULT ICON ISSUE =================
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// ================= LOCATION PICKER =================
const LocationPicker = ({ setLocation }) => {
  useMapEvents({
    click(e) {
      setLocation({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      });
    },
  });

  return null;
};

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState(null);

  const service = services.find((s) => s.id === Number(id));

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-xl font-bold">Service Not Found</h2>
      </div>
    );
  }

  // ================= GPS LOCATION =================
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        alert("Unable to fetch location");
      }
    );
  };

  // ================= BOOKING =================
  const handleBooking = () => {
    if (!date || !time) {
      alert("Please select date & time ⚠️");
      return;
    }

    if (!location) {
      alert("Please select your location 📍");
      return;
    }

    const booking = {
      ...service,
      date,
      time,
      location,
    };

    const existing = JSON.parse(localStorage.getItem("bookings")) || [];
    existing.push(booking);

    localStorage.setItem("bookings", JSON.stringify(existing));

    alert("Booking Confirmed ✅");

    navigate("/services");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

      <div className="max-w-5xl w-full bg-white rounded-2xl shadow-lg overflow-hidden grid md:grid-cols-2">

        {/* LEFT IMAGE */}
        <div>
          <img
            src={service.image}
            alt={service.name}
            className="h-full w-full object-cover"
          />
        </div>

        {/* RIGHT CONTENT */}
        <div className="p-8">

          <h1 className="text-3xl font-bold text-gray-800">
            {service.name}
          </h1>

          <p className="text-gray-500 mt-1">
            {service.category}
          </p>

          <p className="text-gray-500">
            📍 {service.location}
          </p>

          <p className="text-blue-600 font-bold text-xl mt-3">
            Rs {service.price}
          </p>

          {/* GPS BUTTON */}
          <button
            onClick={getCurrentLocation}
            className="w-full mt-6 mb-3 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            📍 Use My Current Location
          </button>

          {/* MAP */}
          <div className="mt-4">
            <h2 className="font-semibold mb-2">
              Pin Your Location 📍
            </h2>

            <div className="h-64 rounded-lg overflow-hidden border">

              <MapContainer
                center={
                  location
                    ? [location.lat, location.lng]
                    : [30.3753, 69.3451]
                }
                zoom={location ? 14 : 5}
                className="h-full w-full"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                <LocationPicker setLocation={setLocation} />

                {location && (
                  <Marker position={[location.lat, location.lng]} />
                )}
              </MapContainer>

            </div>

            {location && (
              <p className="text-sm text-green-600 mt-2">
                Selected: {location.lat.toFixed(4)},{" "}
                {location.lng.toFixed(4)}
              </p>
            )}
          </div>

          {/* BOOKING */}
          <div className="mt-8 border-t pt-6">

            <h2 className="text-lg font-semibold mb-4">
              Book This Service
            </h2>

            <div className="space-y-4">

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-3 border rounded-lg"
              />

              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-3 border rounded-lg"
              />

              <button
                onClick={handleBooking}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
              >
                Confirm Booking
              </button>

              <button
                onClick={() => navigate("/services")}
                className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg"
              >
                Back to Services
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default ServiceDetails;