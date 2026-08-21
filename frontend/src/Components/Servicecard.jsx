import React from "react";
import { useNavigate } from "react-router-dom";

const ServiceCard = ({ service }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/service/${service.id}`)}
      className="border p-4 rounded-lg shadow-md bg-white cursor-pointer hover:shadow-xl transition"
    >
      <h2 className="text-xl font-bold">{service.name}</h2>

      <p className="text-gray-600">
        Category: {service.category}
      </p>

      <p className="text-gray-600">
        Location: {service.location}
      </p>

      <p className="text-blue-600 font-semibold">
        Price: Rs {service.price}
      </p>

      <button
        onClick={(e) => {
          e.stopPropagation(); // important
          navigate(`/service/${service.id}`);
        }}
        className="mt-3 bg-blue-500 text-white px-4 py-2 rounded"
      >
        View Details
      </button>
    </div>
  );
};

export default ServiceCard;