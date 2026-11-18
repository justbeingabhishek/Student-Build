import { useParams } from "react-router-dom";
import RoleCard from "../components/user/RoleCard";
import Back from "../components/ui/Back";
import TeamMates from "../components/ui/TeamMates";
import { useContext, useEffect, useState } from "react";
import { isAxiosError } from "axios";
import api from "../../Services/api";
import { userContext } from "../context/UserContext";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "../components/error/PageState";

interface ProjectDetails {
  _id: string;
  title: string;
  description: string;
  owner?: { _id?: string; name?: string };
  application?: number;
  teamSize?: string;
  coverImage?: string;
  rolesNeeded?: string[];
  techStack?: string[];
  ownProject?: boolean;
  applied?: boolean;
  applicationStatus?: string | null;
  role?: string | null;
  team?: Array<{
    _id: string;
    name?: string;
    profile?: string;
    role?: string | null;
  }>;
}

const ProjectInfo = () => {
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [loadedProjectId, setLoadedProjectId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<{
    projectId: string;
    notFound: boolean;
  } | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const { id } = useParams();

  const context = useContext(userContext);
  const setApplicationInfo = context?.setApplicationInfo;
  const currentProjectId = id ?? "";
  const loading = loadedProjectId !== currentProjectId;
  const currentError =
    loadError?.projectId === currentProjectId ? loadError : null;

  useEffect(() => {
    let active = true;

    const fetchProjectInformation = async () => {
      try {
        const response = await api.get(`/projects/${id}`);
        if (!active) return;

        if (!response.data.project) {
          setLoadError({ projectId: currentProjectId, notFound: true });
          return;
        }

        setProject(response.data.project);
        setApplicationInfo?.(response.data.project);
        setLoadError(null);
      } catch (error) {
        if (!active) return;
        setLoadError({
          projectId: currentProjectId,
          notFound: isAxiosError(error) && error.response?.status === 404,
        });
        console.error("Error fetching project information:", error);
      } finally {
        if (active) setLoadedProjectId(currentProjectId);
      }
    };

    void fetchProjectInformation();
    return () => {
      active = false;
    };
  }, [id, retryCount, currentProjectId, setApplicationInfo]);

  if (loading) {
    return <LoadingState label="Loading project..." />;
  }

  if (currentError?.notFound) {
    return (
      <EmptyState
        title="Project not found"
        description="This project may have been removed or the link may be incorrect."
        actionLabel="Explore projects"
        actionTo="/explore"
      />
    );
  }

  if (currentError) {
    return (
      <ErrorState
        title="Project couldn’t be loaded"
        description="Project details couldn’t be loaded. Please try again."
        onRetry={() => {
          setLoadError(null);
          setLoadedProjectId(null);
          setRetryCount((count) => count + 1);
        }}
      />
    );
  }

  if (!project) {
    return (
      <EmptyState
        title="Project not found"
        description="This project may have been removed or the link may be incorrect."
        actionLabel="Explore projects"
        actionTo="/explore"
      />
    );
  }

  const gradient = project?.coverImage;

  const from = gradient?.match(/from-\[(#[0-9A-Fa-f]{6})\]/)?.[1];
  const to = gradient?.match(/to-\[(#[0-9A-Fa-f]{6})\]/)?.[1];

  return (
    <div className="h-full w-full flex py-3 flex-col  pb-20  gap-4">
      <Back />
      <div
        style={{
          background:
            from && to
              ? `linear-gradient(135deg, ${from}, ${to})`
              : "linear-gradient(135deg, #047857, #A7F3D0)",
        }}
        className="h-37.5 rounded-[14px]"
      ></div>

      {/* Project information */}
      <div>
        <span className="text-[26px] capitalize font-bold tracking-[-0.02em]">
          {project.title}
        </span>
        <div className="text-[13px] flex flex-col gap-2 text-[#5C5964] mt-1">
          <span>By {project?.owner?.name || "Unknown"}</span>
          <div className="capitalize">
            <span>{project?.application} application</span> ·{" "}
            <span>{project?.rolesNeeded?.length || 0} Roles</span> ·{" "}
            <span>{project?.teamSize || 0} members</span>
          </div>
        </div>
      </div>

      {/* description and  tech stack  */}
      <div>
        <span className="text-[15px] text-[#16151A]">{project.description}</span>
        <div className="flex flex-wrap gap-4 capitalize text-[13px] mt-2">
          {project?.techStack?.join(" · ")}
        </div>
      </div>

      {/* Roles section  */}
      <div>
        <span className="text-[16px] font-bold ">Roles needed</span>
        {project?.applicationStatus === "accepted" && (
          <div className="mt-2 rounded-[10px] border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
            You joined this project as{" "}
            <span className="font-semibold">{project.role}</span>.
          </div>
        )}
        <div className="flex flex-col gap-2 mt-2.5">
          {project?.rolesNeeded?.map((role) => (
            <RoleCard
              ownProject={project.ownProject ?? false}
              key={role}
              applied={project.applied ?? false}
              applicationStatus={project.applicationStatus ?? null}
              appliedFor={project.role ?? null}
              role={role}
            />
          ))}
          {project?.rolesNeeded?.length === 0 && (
            <p className="text-sm text-[#5C5964]">No open roles right now.</p>
          )}
        </div>
      </div>

      <section className="rounded-[14px] border border-[#E4E1D9] bg-white p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-[#16151A]">Project team</h2>
            <p className="mt-1 text-xs text-[#77747C]">
              People working together on this project
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-[#F1F0EC] px-2.5 py-1 text-xs font-medium text-[#5C5964]">
            {project?.team?.length ?? 0}{" "}
            {(project?.team?.length ?? 0) === 1 ? "member" : "members"}
          </span>
        </div>

        {project?.team?.length ? (
          <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {project.team.map((data) => (
              <TeamMates
                key={data._id}
                data={data}
                ownerId={project?.owner?._id}
              />
            ))}
          </div>
        ) : (
          <p className="mt-4 rounded-xl border border-dashed border-[#E4E1D9] px-3 py-5 text-center text-sm text-[#77747C]">
            Team members will appear here.
          </p>
        )}
      </section>
    </div>
  );
};

export default ProjectInfo;
