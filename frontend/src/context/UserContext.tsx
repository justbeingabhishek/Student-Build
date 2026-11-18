import { createContext, useEffect, useState } from "react";
import api from "../../Services/api.ts";

interface UserContextType {
  user: any;
  setUser: (user: any) => void;
  notificationCount: number;
  setNotificationCount: (count: number | ((current: number) => number)) => void;
  loading: boolean;
  projects: any[];
  projectsLoading: boolean;
  projectsError: string | null;
  fetchProjects: () => Promise<void>;
  applicationInfo: any;
  setApplicationInfo: (info: any) => void;
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
  const [notificationCount, setNotificationCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [projects, setProjcts] = useState<any[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectsError, setProjectsError] = useState<string | null>(null);
  const [applicationInfo,setApplicationInfo] = useState(null);

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
    setProjectsLoading(true);
    setProjectsError(null);
    try {
      const response = await api.get("/projects", { withCredentials: true });
      console.log("Projects fetched successfully:", response.data);
      setProjcts(response.data.projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setProjectsError("Unable to load projects. Please try again.");
    } finally {
      setProjectsLoading(false);
      setLoading(false);
    }
  };

  const value = {
    user,
    setUser,
    notificationCount,
    setNotificationCount,
    loading,
    setLoading,
    projects,
    setProjcts,
    projectsLoading,
    projectsError,
    fetchProjects,
    applicationInfo,
    setApplicationInfo,
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    fetchUser();
  }, []);

  return <userContext.Provider value={value}>{children}</userContext.Provider>;
};
