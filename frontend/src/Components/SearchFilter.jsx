import React from "react";

const SearchFilter = ({ filters, setFilters }) => {
  return (
    <div className="flex gap-3 flex-wrap mb-5">

      {/* Search */}
      <input
        type="text"
        placeholder="Search..."
        className="border p-2 rounded"
        value={filters.search}
        onChange={(e) =>
          setFilters({ ...filters, search: e.target.value })
        }
      />

      {/* Category */}
      <select
        className="border p-2 rounded"
        value={filters.category}
        onChange={(e) =>
          setFilters({ ...filters, category: e.target.value })
        }
      >
        <option value="">All Categories</option>
        <option value="Electrician">Electrician</option>
        <option value="Plumber">Plumber</option>
        <option value="Tutor">Tutor</option>
      </select>

      {/* Location */}
      <select
        className="border p-2 rounded"
        value={filters.location}
        onChange={(e) =>
          setFilters({ ...filters, location: e.target.value })
        }
      >
        <option value="">All Locations</option>
        <option value="Lahore">Lahore</option>
        <option value="Karachi">Karachi</option>
        <option value="Islamabad">Islamabad</option>
      </select>

      {/* Max Price */}
      <input
        type="number"
        placeholder="Max Price"
        className="border p-2 rounded"
        value={filters.price}
        onChange={(e) =>
          setFilters({ ...filters, price: e.target.value })
        }
      />
    </div>
  );
};

export default SearchFilter;