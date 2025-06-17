import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import logo from "../assets/logo.png";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

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

  const location = useLocation();

  const isDashboard = location.pathname === "/dashboard";

  const links = [
    { icon: "mdi:view-dashboard", label: "Dashboard", path: "/dashboard" },
    { icon: "mdi:folder-outline", label: "Categories", path: "/categories" },
  ];

  return (
    <nav
      className="w-full h-20 flex justify-between items-center px-6 py-4 shadow-md bg-white"
      role="navigation"
      aria-label="Main Navigation"
    >

      <div className="flex items-center h-full" aria-label="Application Logo">
        <img src={logo} alt="MyTodo App Logo" className="h-40 w-auto object-contain" />
      </div>


      <div className="hidden lg:flex items-center space-x-6">
        {isDashboard && (
          <>

            <div className="relative w-48">
              <span className="absolute left-2 top-2.5 text-orange-800">
                <Icon icon="mdi:magnify" className="w-5 h-5" color="#9C4900" />
              </span>
              <Input
                type="text"
                placeholder="Search todos..."
                aria-label="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>


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
          </>
        )}

  
        <div
          className="flex flex-col text-sm text-gray-700 leading-tight"
          aria-label="Current Date and Time"
        >
          <div className="flex items-center gap-1">
            <Icon icon="mdi:calendar" color="#9C4900" className="w-4 h-4" />
            <span>{currentDate}</span>
          </div>
          <div className="flex items-center gap-1">
            <Icon icon="mdi:clock-outline" color="#9C4900" className="w-4 h-4" />
            <span>{currentTime}</span>
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open Menu">
              <Menu />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="center" side="bottom" className="p-4 w-screen">
            {isDashboard && (
              <>

                <div className="relative w-full mb-4">
                   <span className="absolute left-2 top-2.5 text-orange-800">
                     <Icon icon="mdi:magnify" color="#9C4900" className="w-5 h-5" />
                   </span>
                   <Input
                     type="text"
                     placeholder="Search todos..."
                     aria-label="Search"
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="pl-8 w-full"
                   />
                 </div>


                 <select
                   aria-label="Filter"
                   className="p-2 border rounded-md w-full mb-4"
                   value={filter}
                   onChange={(e) => setFilter(e.target.value)}
                 >
                   <option value="all">All</option>
                   <option value="completed">Completed</option>
                   <option value="incomplete">Incomplete</option>
                 </select>
               </>
            )}

            <div
              className="flex flex-col text-sm text-gray-700 leading-tight mb-4"
              aria-label="Current Date and Time"
            >
              <div className="flex items-center gap-1">
                <Icon icon="mdi:calendar" color="#9C4900" className="w-4 h-4" />
                <span>{currentDate}</span>
              </div>
              <div className="flex items-center gap-1">
                <Icon icon="mdi:clock-outline" color="#9C4900" className="w-4 h-4" />
                <span>{currentTime}</span>
              </div>
            </div>

            <nav className="mt-6 space-y-4 text-orange-800 text-sm font-semibold">
              {links.map((item, idx) => (
                <DropdownMenuItem asChild key={idx}>
                   <Link
                     to={item.path}
                     aria-label={`Go to ${item.label}`}
                     className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100"
                   >
                     <Icon icon={item.icon} color="#9C4900" />
                     <span>{item.label}</span>
                   </Link>
                 </DropdownMenuItem>
               ))}
              <DropdownMenuItem asChild>
                <Link
                   to="/"
                   aria-label="Logout"
                   className="flex items-center gap-2 p-2 text-red-600 font-semibold rounded-md hover:bg-gray-100"
                 >
                   <Icon icon="mdi:logout" color="#9C4900" />
                   <span>Logout</span>
                 </Link>
               </DropdownMenuItem>
            </nav>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
