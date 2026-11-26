import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import {
  ClipboardList,
  LoaderCircle,
  LogOut,
  Pencil,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import api from "../../Services/api";
import ProfileInfo from "../components/user/ProfileInfo";
import ProfilePicture from "../components/user/ProfilePicture";
import ProjectPost from "../components/user/ProjectPost";
import { userContext } from "../context/UserContext";

interface ProfileUser {
  id?: string;
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
  MyProjects?: Array<string | { _id?: string }>;
  Myapplications?: string[];
}

interface ProfileProject {
  _id: string;
  title: string;
  description: string;
  owner?: string | { _id?: string };
  coverImage?: string;
  category?: string;
  teamSize?: string;
  techStack?: string[];
  rolesNeeded?: string[];
}

const getReferenceId = (reference?: string | { _id?: string }) =>
  typeof reference === "string" ? reference : reference?._id;

const Profile = () => {
  const context = useContext(userContext);
  const setContextUser = context?.setUser;
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  const [projects, setProjects] = useState<ProfileProject[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectsError, setProjectsError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const user = context?.user as ProfileUser | null | undefined;
  const userId = user?._id || user?.id;

  useEffect(() => {
    let active = true;

    const fetchProjects = async () => {
      setProjectsLoading(true);
      setProjectsError(null);
      try {
        const [profileResponse, projectsResponse] = await Promise.all([
          api.get("/users/me"),
          api.get("/users/me/projects"),
        ]);
        if (active) {
          setContextUser?.(profileResponse.data.user);
          setProjects(projectsResponse.data.projects);
        }
      } catch (error) {
        console.error("Unable to load profile projects:", error);
        if (active) {
          setProjectsError("Your projects couldn’t be loaded. Please try again.");
        }
      } finally {
        if (active) setProjectsLoading(false);
      }
    };

    void fetchProjects();
    return () => {
      active = false;
    };
  }, [retryCount, setContextUser]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await api.post("/auth/logout");
      context?.setUser(null);
      toast.success("You have been logged out.");
      navigate("/login", { replace: true });
    } catch (error) {
      const message = isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message || "Unable to log out. Please try again."
        : "Unable to log out. Please try again.";
      toast.error(message);
      console.error("Logout failed:", error);
    } finally {
      setLoggingOut(false);
    }
  };

  if (!user) {
    return <p className="text-sm text-[#6B6872]">Loading profile...</p>;
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 pb-24 md:gap-8">
      <ProfilePicture user={user} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-x-7 gap-y-3">
          <ProfileInfo type="projects" count={projects.length} />
          <ProfileInfo
            type="applications"
            count={user.Myapplications?.length ?? 0}
          />
        </div>
        <button
          type="button"
          onClick={() => navigate("/edit-info")}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[#DAD7CF] bg-white px-4 text-sm font-semibold text-[#16151A] transition hover:bg-[#F7F6F2]"
        >
          <Pencil size={15} />
          Edit profile
        </button>
      </div>

      {user.skills?.length ? (
        <section>
          <h2 className="text-sm font-semibold text-[#16151A]">Skills</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {user.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex min-h-8 items-center rounded-full border border-[#DAD7CF] bg-white px-3 text-xs font-medium text-[#3D3A44]"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      <section aria-labelledby="projects-heading">
        <div className="mb-4 flex items-center justify-between border-t border-[#E4E1D9] pt-4">
          <h2
            id="projects-heading"
            className="text-xs font-semibold uppercase tracking-[0.14em] text-[#3D3A44]"
          >
            Projects
          </h2>
          <button
            type="button"
            onClick={() => navigate("/my-applications")}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-2 text-xs font-medium text-[#5C5964] transition hover:bg-white"
          >
            <ClipboardList size={15} />
            My applications
          </button>
        </div>

        {projectsLoading ? (
          <p className="py-12 text-center text-sm text-[#6B6872]">
            Loading your projects…
          </p>
        ) : projectsError ? (
          <div className="rounded-2xl border border-[#E4E1D9] bg-white px-4 py-10 text-center">
            <p className="text-sm text-[#5C5964]">{projectsError}</p>
            <button
              type="button"
              onClick={() => setRetryCount((count) => count + 1)}
              className="mt-3 text-sm font-semibold text-[#2F4BE0] hover:underline"
            >
              Try again
            </button>
          </div>
        ) : projects.length ? (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-4">
            {projects.map((project) => (
              <ProjectPost
                key={project._id}
                project={project}
                canManage={
                  Boolean(userId) &&
                  (getReferenceId(project.owner)
                    ? getReferenceId(project.owner) === userId
                    : Boolean(
                        user.MyProjects?.some(
                          (reference) =>
                            getReferenceId(reference) === project._id,
                        ),
                      ))
                }
                onUpdated={(updatedProject) =>
                  setProjects((current) =>
                    current.map((item) =>
                      item._id === updatedProject._id ? updatedProject : item,
                    ),
                  )
                }
                onDeleted={(projectId) => {
                  setProjects((current) =>
                    current.filter((item) => item._id !== projectId),
                  );
                  void context?.fetchProjects();
                }}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-[#DAD7CF] bg-white/70 px-4 py-12 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#16151A] text-[#16151A]">
              <Plus size={27} strokeWidth={1.7} />
            </span>
            <h3 className="mt-4 text-lg font-semibold text-[#16151A]">
              Share your first project
            </h3>
            <p className="mt-1 max-w-sm text-sm text-[#6B6872]">
              Projects you create will show up here as posts.
            </p>
            <button
              type="button"
              onClick={() => navigate("/post")}
              className="mt-4 min-h-10 rounded-lg bg-[#2F4BE0] px-4 text-sm font-semibold text-white transition hover:bg-[#263FC5]"
            >
              Create project
            </button>
          </div>
        )}
      </section>

      <div className="flex flex-wrap gap-3 border-t border-[#E4E1D9] pt-4">
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="ml-auto flex min-h-10 items-center justify-center gap-2 rounded-lg px-3 text-sm font-medium text-[#B42318] transition hover:bg-[#FFF7F6] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loggingOut ? (
            <LoaderCircle size={17} className="animate-spin" />
          ) : (
            <LogOut size={17} />
          )}
          {loggingOut ? "Logging out..." : "Log out"}
        </button>
      </div>
    </div>
  );
};

export default Profile;
