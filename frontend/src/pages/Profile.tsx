import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardList, FolderKanban, LogOut, Pencil } from "lucide-react";
import ProfileInfo from "../components/user/ProfileInfo";
import ProfilePicture from "../components/user/ProfilePicture";
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
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 pb-24 md:gap-6">
      <header className="px-1">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#77747C]">
          Your account
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#16151A] sm:text-3xl">
          Profile
        </h1>
      </header>

      <ProfilePicture user={user} />

      <div className="grid w-full grid-cols-2 gap-3 sm:gap-4">
        <ProfileInfo type="Projects" count={user.MyProjects?.length ?? 0} />
        <ProfileInfo
          type="Applications"
          count={user.Myapplications?.length ?? 0}
        />
      </div>

      <section className="rounded-2xl border border-[#E4E1D9] bg-white p-4 sm:p-5">
        <h2 className="text-lg font-semibold text-[#16151A]">Skills</h2>
        <p className="mt-1 text-sm text-[#77747C]">
          Technologies and tools you work with
        </p>
        {user.skills?.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {user.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex min-h-9 items-center rounded-full border border-[#DAD7CF] bg-[#F7F6F2] px-3 text-sm font-medium text-[#3D3A44]"
              >
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-[#6B6872]">
            Add skills to your profile.
          </p>
        )}
      </section>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => navigate("/edit-info")}
          className="col-span-2 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#2F4BE0] px-4 text-sm font-semibold text-white transition hover:bg-[#263FC5]"
        >
          <Pencil size={17} />
          Edit profile
        </button>

        <button
          type="button"
          onClick={() => navigate("/my-projects")}
          className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#E4E1D9] bg-white px-3 text-sm font-semibold text-[#16151A] transition hover:bg-[#F7F6F2]"
        >
          <FolderKanban size={17} />
          My Projects
        </button>

        <button
          type="button"
          onClick={() => navigate("/my-applications")}
          className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#E4E1D9] bg-white px-3 text-sm font-semibold text-[#16151A] transition hover:bg-[#F7F6F2]"
        >
          <ClipboardList size={17} />
          My Applications
        </button>

        <button
          type="button"
          className="col-span-2 flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#F0C4BF] bg-white px-4 text-sm font-semibold text-[#B42318] transition hover:bg-[#FFF7F6]"
        >
          <LogOut size={17} />
          Log out
        </button>
      </div>
    </div>
  );
};

export default Profile;
