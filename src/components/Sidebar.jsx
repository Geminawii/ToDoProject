import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function SidebarResponsive() {
  const userData = JSON.parse(localStorage.getItem("userData")) || {};

  return (
    <div className="flex">
      {/* Static, collapsible sidebar for large screens */}
      <div className="hidden lg:flex">
        <SidebarContent
          username={userData?.username}
          email={userData?.email}
          avatar={userData?.avatar}
        />
      </div>

      <div className="lg:hidden p-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open Sidebar">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="p-4 w-64">
            <SidebarContent
              username={userData?.username}
              email={userData?.email}
              avatar={userData?.avatar}
            />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

function SidebarContent({ username, email, avatar }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`flex flex-col justify-between p-4 border-r shadow-sm bg-white transition-all duration-500 ease-in-out relative ${
        isCollapsed ? "w-20" : "w-64"
      }  h-screen sticky top-0`}
    >
      <div>
        <div className="flex flex-col items-center space-y-2">
          <Avatar className={isCollapsed ? "w-8 h-8" : "w-16 h-16"}>
            <AvatarImage src={avatar} alt="User Avatar" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>

          {!isCollapsed && (
            <>
              <h2 className="text-lg font-semibold text-orange-800">
                {username}
              </h2>
              <p className="text-sm text-gray-600 text-center">{email}</p>
            </>
          )}
        </div>

        <nav className="mt-6 space-y-4 text-orange-800 text-sm font-semibold">
          {[
            { icon: "mdi:view-dashboard", label: "Dashboard", path: "/dashboard" },
            {
              icon: "mdi:check-circle",
              label: "Completed Tasks",
              path: "/completed",
            },
            {
              icon: "mdi:alert-circle-outline",
              label: "Outstanding Tasks",
              path: "/uncompleted",
            },
          ].map((item, idx) => (
            <Link
              key={idx}
              to={item.path}
              className="flex items-center gap-2 hover:text-orange-600 cursor-pointer p-2 rounded-md"
            >
              <Icon icon={item.icon} />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          ))}
          <Link
            to="/"
            className="flex items-center gap-2 text-red-600 font-semibold hover:text-red-800 p-2 rounded-md"
          >
            <Icon icon="mdi:logout" />
            {!isCollapsed && <span>Logout</span>}
          </Link>
        </nav>
      </div>

      <button
        aria-label="Toggle Sidebar"
        onClick={() => setIsCollapsed((prev) => !prev)}
        className="absolute top-1/8 -right-4 transform -translate-y-1/2 p-1 bg-orange-800 text-gray-100 rounded-full shadow-md"
      >
        {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
      </button>
    </aside>
  );
}
