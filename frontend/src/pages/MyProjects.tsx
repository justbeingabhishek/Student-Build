import { useEffect, useState } from "react";
import api from "../../Services/api";
import ProjectCard from "../components/user/ProjectCard";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "../components/error/PageState";

const MyProjects = () => {
  const [project, setProject] = useState<{ _id: string }[]>([]);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState<string | null>(null);
  const [retryCount,setRetryCount] = useState(0);

  useEffect(() => {
    let active = true;

    const fetchMyProject = async () => {
      try {
        const response = await api.get("/users/me/projects");
        if (active) setProject(response.data.projects);
      } catch (requestError) {
        console.error("Unable to load projects:", requestError);
        if (active) {
          setError("Your projects couldn’t be loaded. Please try again.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void fetchMyProject();
    return () => {
      active = false;
    };
  }, [retryCount]);

  return (
    <div className="h-full w-full flex py-3 flex-col  pb-20  gap-8">
      <div>
        <h2 className="font-bold text-2xl tracking-[-0.02em]">My Projects</h2>
      </div>
      <div className="flex items-center flex-col gap-3.5">
        {loading ? (
          <LoadingState label="Loading your projects..." />
        ) : error ? (
          <ErrorState
            title="Your projects couldn’t be loaded"
            description={error}
            onRetry={() => {
              setError(null);
              setLoading(true);
              setRetryCount((count) => count + 1);
            }}
          />
        ) : project.length === 0 ? (
          <EmptyState
            title="You haven’t created a project yet"
            description="Create a project to find collaborators and build your team."
            actionLabel="Create a project"
            actionTo="/post"
          />
        ) : (
          project.map((project) => (
            <ProjectCard project={project} key={project._id} />
          ))
        )}
      </div>
    </div>
  );
};

export default MyProjects;
