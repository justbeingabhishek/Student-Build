import { useEffect, useState } from "react";
import ReviewCard from "../components/ui/ReviewCard";
import { useParams } from "react-router-dom";
import api from "../../Services/api";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "../components/error/PageState";

interface ApplicationReview {
  _id: string;
  status: string;
  role?: string;
  reason?: string;
  portfolioLink?: string;
  user?: {
    name?: string;
    skills?: string[];
  };
}

const ReviewApplications = () => {
  const filters = ["Pending", "Rejected", "Accepted"];
  const { id } = useParams();

  const [applications, setApplications] = useState<ApplicationReview[]>([]);
  const [activeFilter, setActiveFilter] = useState("Pending");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let active = true;

    const fetchApplications = async () => {
      try {
        const response = await api.get(
          `/application/application/project/${id}/?sort=Latest`,
        );
        if (active) {
          setApplications(response.data.applications);
          setLoadError(null);
        }
      } catch (error) {
        console.error("Unable to load applications:", error);
        if (active) {
          setLoadError(
            "Applicant information couldn’t be loaded. Please try again.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void fetchApplications();
    return () => {
      active = false;
    };
  }, [id, retryCount]);

  const pendingCount = applications.filter(
    (data) => data.status === "pending",
  ).length;

  const acceptedCount = applications.filter(
    (data) => data.status === "accepted",
  ).length;

  const rejectedCount = applications.filter(
    (data) => data.status === "rejected",
  ).length;

  const applcationsAfterFilter = applications.filter(
    (app) => app.status === activeFilter.toLowerCase(),
  );

  return (
    <div className="h-full w-full flex py-3 flex-col  pb-20  gap-8">
      <div>
        <h2 className="font-semibold text-2xl">AlgoViz Pro applicants</h2>
      </div>

      {loading ? (
        <LoadingState label="Loading applications..." />
      ) : loadError ? (
        <ErrorState
          title="Applicants couldn’t be loaded"
          description={loadError}
          onRetry={() => {
            setLoadError(null);
            setLoading(true);
            setRetryCount((count) => count + 1);
          }}
        />
      ) : applications.length === 0 ? (
        <EmptyState
          title="No applications yet"
          description="When students apply to this project, their applications will appear here."
        />
      ) : (
        <>
          <div className="flex overflow-x-scroll bar text-nowrap items-center gap-3">
            {filters.map((filter) => {
              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`
              min-h-9 rounded-full border px-3.5
              text-[13px] font-medium cursor-pointer transition-colors
              ${
                activeFilter == filter
                  ? "border-[#16151A] bg-[#16151A] text-white"
                  : "border-[#DAD7CF] bg-white text-[#16151A] hover:bg-[#F7F6F2]"
              }
            `}
                >
                  {filter}{" "}
                  {filter == "Pending"
                    ? pendingCount
                    : filter == "Accepted"
                      ? acceptedCount
                      : rejectedCount}
                </button>
              );
            })}
          </div>

          <div className="flex items-center flex-col gap-8">
            {applcationsAfterFilter.length === 0 ? (
              <EmptyState
                title={`No ${activeFilter.toLowerCase()} applications`}
                description={`There are no ${activeFilter.toLowerCase()} applications for this project.`}
              />
            ) : (
              applcationsAfterFilter.map((data) => (
              <ReviewCard
                key={data._id}
                name={data.user?.name ?? "Unknown applicant"}
                role={data.role ?? "Unspecified role"}
                initials={data.user?.name?.slice(0, 2) ?? "?"}
                avatarColor="#7C3AED"
                message={data.reason ?? ""}
                portfolio={data.portfolioLink ?? ""}
                skills={data.user?.skills ?? []}
                status={data.status}
                id={data._id}
                fetchApplcation={() =>
                  setRetryCount((count) => count + 1)
                }
              />
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ReviewApplications;
