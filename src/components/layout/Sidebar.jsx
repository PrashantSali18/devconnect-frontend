import { NavLink } from 'react-router-dom';
import { HomeIcon, MapIcon, BellIcon, UserIcon } from '@heroicons/react/24/outline';
import { useSelector } from 'react-redux';

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);

  const navItems = [
    { path: '/', icon: HomeIcon, label: 'Home' },
    { path: '/explore', icon: MapIcon, label: 'Explore' },
    { path: '/notifications', icon: BellIcon, label: 'Notifications' },
    { path: `/profile/${user?._id}`, icon: UserIcon, label: 'Profile' },
  ];

  return (
    <aside className="w-64 border-r border-gray-200 bg-white min-h-screen pt-20 hidden md:block">
      <nav className="p-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-all ${
                isActive
                  ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-600'
                  : 'text-gray-700 hover:bg-gray-100'
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