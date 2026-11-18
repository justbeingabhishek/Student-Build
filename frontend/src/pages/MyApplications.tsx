import { useEffect, useState } from "react";
import api from "../../Services/api";
import ApplicationCard from "../components/user/ApplicationCard";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "../components/error/PageState";

const MyApplications = () => {
  const [applications, setApplications] = useState<{ _id: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let active = true;

    const fetchAllApplications = async () => {
      try {
        const response = await api.get("/application/me");
        if (active) setApplications(response.data.application);
      } catch (requestError) {
        console.error("Unable to load applications:", requestError);
        if (active) {
          setError("Your applications couldn’t be loaded. Please try again.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void fetchAllApplications();
    return () => {
      active = false;
    };
  }, [retryCount]);

  return (
    <div className="h-full w-full flex py-3 flex-col  pb-20  gap-8">
      <div>
        <h2 className="font-bold text-2xl tracking-[-0.02em]">My Applications</h2>
      </div>
      <div className="flex items-center flex-col gap-3.5">
        {loading ? (
          <LoadingState label="Loading your applications..." />
        ) : error ? (
          <ErrorState
            title="Your applications couldn’t be loaded"
            description={error}
            onRetry={() => {
              setError(null);
              setLoading(true);
              setRetryCount((count) => count + 1);
            }}
          />
        ) : applications.length === 0 ? (
          <EmptyState
            title="You haven’t applied to a project yet"
            description="Explore open projects and apply for a role that fits your skills."
            actionLabel="Explore projects"
            actionTo="/explore"
          />
        ) : (
          applications.map((application) => (
            <ApplicationCard
              key={application._id}
              application={application}
            />
          ))
        )}
      </div>
    </div>
  );
};
export default MyApplications;
