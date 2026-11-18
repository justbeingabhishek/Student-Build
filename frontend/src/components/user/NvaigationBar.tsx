import { House, Search, CirclePlus, Bell, User } from "lucide-react";
import { useContext, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import api from "../../../Services/api.ts";
import { userContext } from "../../context/UserContext";

const NvaigationBar = () => {
  const context = useContext(userContext);
  const location = useLocation();
  const notificationCount = context?.notificationCount ?? 0;
  const setNotificationCount = context?.setNotificationCount;

  useEffect(() => {
    let active = true;

    const fetchUnreadCount = async () => {
      try {
        const response = await api.get("/notifications/unread-count", {
          withCredentials: true,
        });
        if (active) {
          setNotificationCount?.(response.data.unreadCount);
        }
      } catch (error) {
        console.error("Unable to fetch unread notification count:", error);
      }
    };

    void fetchUnreadCount();
    return () => {
      active = false;
    };
  }, [location.pathname, setNotificationCount]);

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
      {links.map((data,idx) => {
        return (
          <NavLink
            key={idx}
            to={data.route}
            className="text-xs font-medium text-[#3D3A44] flex flex-col justify-center items-center"
          >
            <span className="relative">
              {data.icon}
              {data.name === "Alerts" && notificationCount > 0 && (
                <span
                  aria-label={`${notificationCount} unread notifications`}
                  className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#B42318] px-1 text-[9px] font-bold leading-none text-white"
                >
                  {notificationCount > 99 ? "99+" : notificationCount}
                </span>
              )}
            </span>
            {data.name}
          </NavLink>
        );
      })}
    </nav>
  );
};

export default NvaigationBar;
