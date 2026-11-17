import { useContext, useEffect } from "react";
import Back from "../components/ui/Back";
import ApplyForm from "../components/user/ApplyForm";
import { userContext } from "../context/UserContext";
import { useParams, useSearchParams } from "react-router-dom";
import api from "../../Services/api";

const Apply = () => {
  const { applicationInfo, setApplicationInfo }: any = useContext(userContext);
  const [searchParams] = useSearchParams();

  const { id } = useParams();
  const role = searchParams.get("role");
  console.log("role is : ", role);
  console.log("id : ", id);
  console.log("application : ", applicationInfo);

  const fetchProjectInformation = async () => {
    try {
      const response = await api.get(`/projects/${id}`);
      setApplicationInfo(response.data.project);
      setApplicationInfo((prv: any) => ({
        ...prv,
        role: role,
      }));
    } catch (error) {
      console.error("Error fetching project information:", error);
    }
  };

  useEffect(() => {
    if (applicationInfo==null) {
      fetchProjectInformation();
    }
  }, [id]);

  return (
    <div className="h-full w-full flex py-3 flex-col  pb-20  gap-3">
      <div>
        <Back />
      </div>
      <div>
        <h2 className="font-bold text-2xl text-[#16151A] ">
          {applicationInfo?.title}
        </h2>
        <span className="text-[13px] text-[#5C5964] mt-4">
          Role: <span className="font-bold">{applicationInfo?.role}</span>
        </span>
      </div>
      <div className="flex items-center flex-col gap-8">
        <ApplyForm />
      </div>
    </div>
  );
};

export default Apply;
