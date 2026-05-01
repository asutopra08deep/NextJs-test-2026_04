"use client";

import { useState, useEffect } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({ onSearch, placeholder = "Search employees..." }: SearchBarProps) {
  const [query, setQuery] = useState("");

  // ⚠ BUG-001: `onSearch` is missing from the dependency array.
  // If the parent re-renders with a new `onSearch` reference, the debounce
  // will keep calling the stale version captured on first render.
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query, onSearch]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <svg
        className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
  );
}
