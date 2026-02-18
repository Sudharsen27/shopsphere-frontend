"use client";

import { useState, useEffect } from "react";

interface FilterOptions {
  category: string;
  brand: string;
  minPrice: string;
  maxPrice: string;
  sort: string;
  order: string;
}

interface ProductFilterProps {
  categories: string[];
  brands: string[];
  onFilterChange: (filters: FilterOptions) => void;
  initialFilters?: Partial<FilterOptions>;
}

export default function ProductFilter({
  categories,
  brands,
  onFilterChange,
  initialFilters = {},
}: ProductFilterProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    category: initialFilters.category || "",
    brand: initialFilters.brand || "",
    minPrice: initialFilters.minPrice || "",
    maxPrice: initialFilters.maxPrice || "",
    sort: initialFilters.sort || "createdAt",
    order: initialFilters.order || "desc",
  });

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handleChange = (key: keyof FilterOptions, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    const cleared = {
      category: "",
      brand: "",
      minPrice: "",
      maxPrice: "",
      sort: "createdAt",
      order: "desc",
    };
    setFilters(cleared);
    onFilterChange(cleared);
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base sm:text-lg font-semibold">Filters</h3>
        <button
          onClick={clearFilters}
          className="text-xs sm:text-sm text-gray-400 hover:text-white transition"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleChange("category", e.target.value)}
            className="w-full px-3 py-2 bg-black border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Brand Filter */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Brand
          </label>
          <select
            value={filters.brand}
            onChange={(e) => handleChange("brand", e.target.value)}
            className="w-full px-3 py-2 bg-black border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">All Brands</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        {/* Min Price */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Min Price (₹)
          </label>
          <input
            type="number"
            value={filters.minPrice}
            onChange={(e) => handleChange("minPrice", e.target.value)}
            placeholder="0"
            min="0"
            className="w-full px-3 py-2 bg-black border border-gray-600 rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Max Price */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Max Price (₹)
          </label>
          <input
            type="number"
            value={filters.maxPrice}
            onChange={(e) => handleChange("maxPrice", e.target.value)}
            placeholder="100000"
            min="0"
            className="w-full px-3 py-2 bg-black border border-gray-600 rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Sort */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Sort By
          </label>
          <select
            value={`${filters.sort}-${filters.order}`}
            onChange={(e) => {
              const [sort, order] = e.target.value.split("-");
              setFilters((prev) => ({ ...prev, sort, order }));
            }}
            className="w-full px-3 py-2 bg-black border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
          </select>
        </div>
      </div>
    </div>
  );
}
