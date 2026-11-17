import { useEffect, useState } from "react";
import ReviewCard from "../components/ui/ReviewCard";
import { useParams } from "react-router-dom";
import api from "../../Services/api";
import { toast } from "sonner";
import EmptyApplications from "../components/error/Noapplication";

const ReviewApplications = () => {
  const filters = ["Pending", "Rejected", "Accepted"];
  const { id } = useParams();

  const [applications, setApplications] = useState([]);
  const [activeFilter, setActiveFilter] = useState("Pending");

  console.log("active filter ", activeFilter);

  const fetchApplications = async () => {
    try {
      const response = await api.get(
        `/application/application/project/${id}/?sort=${"Latest"}`,
      );
      setApplications(response.data.applications);
    } catch (error) {
      console.log("error  : ", error);
      toast.error((error as any).response.data.message);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const pendingCount = applications.filter(
    (data: any) => data.status === "pending",
  ).length;

  const acceptedCount = applications.filter(
    (data: any) => data.status === "accepted",
  ).length;

  const rejectedCount = applications.filter(
    (data: any) => data.status === "rejected",
  ).length;

  console.log("pedning count : ", pendingCount);
  console.log("accepted count : ", acceptedCount);
  console.log("rejected count : ", rejectedCount);

  //  const filteredProjects = select === "All" ? searchResult :
  // searchResult.filter((project: any) => project.category === select);

  const applcationsAfterFilter = applications.filter(
    (app: any) => app.status === activeFilter.toLowerCase(),
  );

  return (
    <div className="h-full w-full flex py-3 flex-col  pb-20  gap-8">
      <div>
        <h2 className="font-semibold text-2xl">AlgoViz Pro applicants</h2>
      </div>

      <div>
        {applications.length == 0 ? (
          ""
        ) : (
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
        )}
      </div>

      <div className="flex items-center flex-col gap-8">
        {applcationsAfterFilter.length == 0 ? (
          <EmptyApplications />
        ) : (
          applcationsAfterFilter.map((data: any, idx: number) => {
            return (
              <ReviewCard
                key={idx}
                name={data?.user?.name}
                role={data?.role}
                initials={data?.user?.name?.slice(0, 2)}
                avatarColor="#7C3AED"
                message={data?.reason}
                portfolio={data?.portfolioLink}
                skills={data?.user?.skills}
                status={data?.status}
                id={data._id}
                fetchApplcation = {fetchApplications}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default ReviewApplications;
