import React from "react";
import { useSearchParams } from "react-router-dom";
import services from "../data/services";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";

  const results = services.filter(
    (item) =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <h1 className="text-xl font-bold mb-6">
        Results for "{query}"
      </h1>

      <div className="grid md:grid-cols-3 gap-4">

        {results.map((item) => (
          <div
            key={item.id}
            className="bg-white p-4 rounded shadow"
          >
            <h3 className="font-bold">{item.name}</h3>
            <p>{item.category}</p>
            <p>{item.location}</p>
          </div>
        ))}

      </div>

    </div>
  );
};

export default SearchPage;