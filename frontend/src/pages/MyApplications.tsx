import { useEffect, useState } from "react";
import api from "../../Services/api";
import ApplicationCard from "../components/user/ApplicationCard";
import { toast } from "sonner";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);

  const fetchAllApllications = async () => {
    try {
      const response = await api.get("/application/me");
      setApplications(response.data.application);
    } catch (error) {
      console.log("error");
      toast.error((error as any).response.data.message);
    }
  };

  useEffect(() => {
    fetchAllApllications();
  }, []);

  return (
    <div className="h-full w-full flex py-3 flex-col  pb-20  gap-8">
      <div>
        <h2 className="font-bold text-2xl tracking-[-0.02em]">My Applications</h2>
      </div>
      <div className="flex items-center flex-col gap-3.5">
        {applications?.map((application) => {
          return <ApplicationCard application = {application} />;
        })}
      </div>
    </div>
  );
};
export default MyApplications;
