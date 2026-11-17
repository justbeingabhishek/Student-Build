import { createContext, useEffect, useState } from "react";
import api from "../../Services/api.ts";

interface UserContextType {
  user: any;
  setUser: (user: any) => void;
}

export const userContext = createContext<UserContextType | undefined>(
  undefined,
);

export const UserContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [projects, setProjcts] = useState<any[]>([]);
  const [applicationInfo,setApplicationInfo] = useState({});

  const value = {
    user,
    setUser,
    loading,
    setLoading,
    projects,
    setProjcts,
    applicationInfo,
    setApplicationInfo
  };

  const fetchUser = async () => {
    setLoading(true);
    console.log("Fetching user data...");
    try {
      const response = await api.get("/users/me", { withCredentials: true });
      console.log("User data fetched successfully:", response.data.user);
      setUser(response.data.user);
    } catch (error) {
      setUser(null);
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await api.get("/projects", { withCredentials: true });
      console.log("Projects fetched successfully:", response.data);
      setProjcts(response.data.projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    fetchUser();
  }, []);

  return <userContext.Provider value={value}>{children}</userContext.Provider>;
};
