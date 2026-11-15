import { useNavigate } from "react-router-dom";
import ProfileInfo from "../components/user/ProfileInfo";
import ProfilePicture from "../components/user/ProfilePicture";
import TechStack from "../components/user/TechStack";

const Profile = () => {
  const tech = ["React", "MongoDb", "Java", "Tailiwnd"];
  const navigate = useNavigate();
  return (
    <div className="h-full w-full flex py-5 flex-col pb-20 gap-8">
      <ProfilePicture />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 w-full">

        <ProfileInfo type="Projects" count={2} />
        <ProfileInfo type="Applications" count={3} />
        <ProfileInfo type="Teammates" count={0} />
      </div>

      <div className="flex gap-2 flex-wrap">
        {tech.map((name, idx) => {
          return <TechStack key={idx} tech={name} />;
        })}
      </div>

      {/* buttons */}

      <div className="flex flex-col gap-3">
        <button className="w-full bg-[#2F4BE0] text-white rounded-xl py-3">
          Edit Profile
        </button>
        <button onClick={()=> navigate("/my-projects")} className="w-full border border-[#DAD7CF] rounded-xl text-[#16151A] py-3">
          My Projects
        </button>
        <button className="w-full border border-[#DAD7CF] text-[#16151A] rounded-xl py-3">
          My Applications
        </button>
        <button className="w-full border border-[#F0C4BF] text-[#B42318] py-3 rounded-xl">
          Log out
        </button>
      </div>
    </div>
  );
};

export default Profile;
