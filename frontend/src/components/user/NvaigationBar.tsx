import { House, Search, CirclePlus, Bell, User } from "lucide-react";
import { NavLink } from "react-router-dom";
const NvaigationBar = () => {
  const links = [
    {
      name: "Home",
      route: "/",
      icon: <House size={20} />,
    },
    {
      name: "Explore",
      route: "/explore",
      icon: <Search size={20} />,
    },
    {
      name: "Post",
      route: "/post",
      icon: <CirclePlus size={20} />,
    },
    {
      name: "Alerts",
      route: "/alert",
      icon: <Bell size={20} />,
    },
    {
      name: "Profile",
      route: "/profile",
      icon: <User size={20} />,
    },
  ];

  return (
    <nav
      className="fixed md:hidden bottom-0 left-0 w-full h-16
                    bg-white border-t border-gray-200
                    flex items-center justify-around
                    z-50"
    >
      {/* Your navigation icons here */}
      {links.map((data) => {
        return (
          <NavLink
            to={data.route}
            className="text-xs font-medium text-[#3D3A44] flex flex-col justify-center items-center"
          >
            {data.icon}
            {data.name}
          </NavLink>
        );
      })}
    </nav>
  );
};

export default NvaigationBar;
