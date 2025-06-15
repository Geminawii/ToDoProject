import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import logo from "../assets/logo.png";

export default function Navbar({ searchTerm, setSearchTerm, filter, setFilter }) {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const currentDate = dateTime.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const currentTime = dateTime.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <nav
      className="w-full h-20 flex justify-between items-center px-6 py-4 shadow-md bg-white"
      role="navigation"
      aria-label="Main Navigation"
    >
      <div className="flex items-center h-full" aria-label="Application Logo">
        <img src={logo} alt="MyTodo App Logo" className="h-40 w-auto object-contain" />
      </div>

      <div className="flex items-center space-x-6">
     
        <Input
          type="text"
          placeholder="Search todos..."
          className="w-48"
          aria-label="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

      
        <select
          aria-label="Filter"
          className="p-2 border rounded-md"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="incomplete">Incomplete</option>
        </select>

        {/* Date and Time Display */}
        <div
          className="flex flex-col text-sm text-gray-700 leading-tight"
          aria-label="Current Date and Time"
        >
          <span>{currentDate}</span>
          <span>{currentTime}</span>
        </div>
      </div>
    </nav>
  );
}
