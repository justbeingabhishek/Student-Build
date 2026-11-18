import { useContext } from "react";
import Card from "../components/user/Card";
import { userContext } from "../context/UserContext";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "../components/error/PageState";

const Home = () => {
  const { projects, projectsLoading, projectsError, fetchProjects } =
    useContext(userContext)!;

  if (projectsLoading) {
    return <LoadingState label="Loading projects..." />;
  }

  if (projectsError) {
    return (
      <ErrorState
        title="Projects couldn’t be loaded"
        description={projectsError}
        onRetry={() => void fetchProjects()}
      />
    );
  }

  return (
    <div className="flex h-full w-full flex-col gap-8 py-3 pb-20">
      <div>
        <h2 className="text-2xl font-semibold">Looking for a team</h2>
      </div>
      <div className="flex items-center flex-col gap-8">
        {projects.length === 0 ? (
          <EmptyState
            title="No projects yet"
            description="There aren’t any projects to explore right now. Check back soon or start one of your own."
            actionLabel="Create a project"
            actionTo="/post"
          />
        ) : (
          projects.map((project) => (
            <Card key={project._id} project={project} />
          ))
        )}
      </div>
    </div>
  );
};


export default Home;
