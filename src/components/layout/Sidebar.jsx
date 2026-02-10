import React from "react";
import { NavLink } from "react-router-dom";
import {
  HomeIcon,
  MapIcon,
  BellIcon,
  UserIcon,
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);

const navItems = [
  { path: "/", icon: HomeIcon, label: "Home" },
  { path: "/explore", icon: MapIcon, label: "Explore" },
  { path: "/search", icon: MagnifyingGlassIcon, label: "Search" },
  { path: "/chat", icon: ChatBubbleLeftRightIcon, label: "Chat" },
  { path: "/notifications", icon: BellIcon, label: "Notifications" },
  { path: `/profile/${user?._id}`, icon: UserIcon, label: "Profile" },
  { path: "/settings", icon: Cog6ToothIcon, label: "Settings" },
];


return (
  <aside className="w-64 min-h-screen pt-20 bg-white border-r border-gray-200">
    <nav className="p-4">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all duration-200 ${
              isActive
                ? "bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600"
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <item.icon className="h-5 w-5" />
          <span className="font-medium">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  </aside>
);
};

export default Sidebar;
