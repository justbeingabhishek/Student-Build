import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import ProfileInfo from "../components/user/ProfileInfo";
import ProfilePicture from "../components/user/ProfilePicture";
import TechStack from "../components/user/TechStack";
import { userContext } from "../context/UserContext";

interface ProfileUser {
  _id?: string;
  name?: string;
  email?: string;
  profile?: string;
  college?: string;
  year?: number;
  bio?: string;
  skills?: string[];
  github?: string;
  portfolio?: string;
  MyProjects?: string[];
  Myapplications?: string[];
}

const Profile = () => {
  const context = useContext(userContext) as
    | { user: ProfileUser | null }
    | undefined;
  const navigate = useNavigate();
  const user = context?.user;

  if (!user) {
    return <p className="text-sm text-[#6B6872]">Loading profile...</p>;
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-3 pb-24">
      <ProfilePicture user={user} />

      <div className="grid w-full grid-cols-2 gap-2">
        <ProfileInfo type="Projects" count={user.MyProjects?.length ?? 0} />
        <ProfileInfo
          type="Applications"
          count={user.Myapplications?.length ?? 0}
        />
      </div>

      <section className="mb-5">
        <h2 className="mb-1.5 text-sm font-semibold text-[#16151A]">Skills</h2>
        {user.skills?.length ? (
          <div className="flex flex-wrap gap-1.5">
            {user.skills.map((skill) => (
              <TechStack key={skill} tech={skill} />
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#6B6872]">Add skills to your profile.</p>
        )}
      </section>

      <div className="flex flex-col gap-1.5">
        <button
          onClick={() => navigate("/edit-info")}
          className="w-full rounded-lg bg-[#2F4BE0] py-2.5 text-xs font-semibold text-white transition hover:bg-[#263FC5]"
        >
          Edit profile
        </button>


        <button
          onClick={() => navigate("/my-projects")}
          className="w-full rounded-lg border border-[#E4E1D9] bg-white py-2.5 text-xs font-semibold text-[#16151A] transition hover:bg-[#F7F6F2]"
        >
          My Projects
        </button>

        <button
          onClick={() => navigate("/my-applications")}
          className="w-full rounded-lg border border-[#E4E1D9] bg-white py-2.5 text-xs font-semibold text-[#16151A] transition hover:bg-[#F7F6F2]"
        >
          My Applications
        </button>

        <button
          type="button"
          className="w-full rounded-lg border border-[#F0C4BF] bg-white py-2.5 text-xs font-semibold text-[#B42318] transition hover:bg-[#FFF7F6]"
        >
          Log out
        </button>
      </div>
    </div>
  );
};

export default Profile;
