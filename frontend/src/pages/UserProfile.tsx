import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import {
  ArrowLeft,
  CalendarDays,
  Code2,
  ExternalLink,
  FolderKanban,
  Link2,
  Mail,
  UserRound,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../Services/api";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "../components/error/PageState";

type ProjectData = {
  _id: string;
  title: string;
  description?: string;
  techStack?: string[];
  owner?: string | { _id?: string };
  team?: Array<string | { _id?: string }>;
};

type ProjectReference = string | { _id?: string };

const getReferenceId = (reference: ProjectReference | undefined) =>
  typeof reference === "string" ? reference : reference?._id;

const fetchProfileProjects = async (
  userId: string,
  projectReferences: ProjectReference[] = [],
) => {
  const response = await api.get<{ projects: ProjectData[] }>("/projects");
  const projectsById = new Map<string, ProjectData>();

  response.data.projects.forEach((project) => {
    const isOwner = getReferenceId(project.owner) === userId;
    const isTeamMember = project.team?.some(
      (member) => getReferenceId(member) === userId,
    );
    if (isOwner || isTeamMember) projectsById.set(project._id, project);
  });

  const missingProjectIds = projectReferences
    .map(getReferenceId)
    .filter((projectId): projectId is string => Boolean(projectId))
    .filter((projectId) => !projectsById.has(projectId));

  await Promise.all(
    missingProjectIds.map(async (projectId) => {
      const projectResponse = await api.get<{ project: ProjectData }>(
        `/projects/${projectId}`,
      );
      if (projectResponse.data.project) {
        projectsById.set(projectId, projectResponse.data.project);
      }
    }),
  );

  return Array.from(projectsById.values());
};

type UserData = {
  name?: string;
  email?: string;
  college?: string;
  career?: string;
  year?: number;
  status?: string;
  bio?: string;
  skills?: string[];
  github?: string;
  portfolio?: string;
  profile?: string;
  createdAt?: string;
  Myapplications?: string[];
  MyProjects?: ProjectReference[];
  SavedProject?: string[];
};

const getExternalUrl = (value: string) => {
  try {
    const trimmedValue = value.trim();
    const url = new URL(
      /^https?:\/\//i.test(trimmedValue)
        ? trimmedValue
        : `https://${trimmedValue}`,
    );
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.href
      : null;
  } catch {
    return null;
  }
};

const getGitHubUrl = (value: string) => {
  const trimmedValue = value.trim();
  if (!trimmedValue) return null;

  if (/^https?:\/\//i.test(trimmedValue)) {
    const url = getExternalUrl(trimmedValue);
    return url && /(^|\.)github\.com$/i.test(new URL(url).hostname)
      ? url
      : null;
  }

  const profilePath = trimmedValue
    .replace(/^(https?:\/\/)?(www\.)?github\.com\//i, "")
    .replace(/^@/, "")
    .replace(/^\/+|\/+$/g, "");
  if (!/^[A-Za-z0-9-]+(?:\/[A-Za-z0-9-]+)?$/.test(profilePath)) {
    return null;
  }

  return `https://github.com/${profilePath}`;
};

export default function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUserId = id ?? "";
  const [userData, setUserData] = useState<UserData | null>(null);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [projectsError, setProjectsError] = useState<string | null>(null);
  const [loadedUserId, setLoadedUserId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<{
    userId: string;
    notFound: boolean;
  } | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const loading = loadedUserId !== currentUserId;
  const currentError =
    loadError?.userId === currentUserId ? loadError : null;

  useEffect(() => {
    let active = true;

    const fetchUserData = async () => {
      if (!id) {
        setLoadError({ userId: currentUserId, notFound: true });
        setLoadedUserId(currentUserId);
        return;
      }

      try {
        setProjects([]);
        setProjectsError(null);
        const response = await api.get(`/users/${id}`);
        if (!active) return;

        if (!response.data.user) {
          setUserData(null);
          setLoadError({ userId: currentUserId, notFound: true });
          return;
        }

        setUserData(response.data.user);
        setLoadError(null);

        try {
          const userProjects = await fetchProfileProjects(
            id,
            response.data.user.MyProjects,
          );
          if (active) setProjects(userProjects);
        } catch (projectError: unknown) {
          if (!active) return;
          console.error("Error fetching user projects:", projectError);
          setProjectsError("Projects couldn’t be loaded. Please try again.");
        }
      } catch (error: unknown) {
        if (!active) return;
        console.error("Error fetching user data:", error);
        setLoadError({
          userId: currentUserId,
          notFound: isAxiosError(error) && error.response?.status === 404,
        });
      } finally {
        if (active) setLoadedUserId(currentUserId);
      }
    };

    void fetchUserData();
    return () => {
      active = false;
    };
  }, [id, currentUserId, retryCount]);

  if (loading) {
    return <LoadingState label="Loading profile..." />;
  }

  if (currentError?.notFound || (!currentError && !userData)) {
    return (
      <EmptyState
        title="Profile not found"
        description="This profile may have been removed or the link may be incorrect."
        actionLabel="Explore projects"
        actionTo="/explore"
      />
    );
  }

  if (currentError) {
    return (
      <ErrorState
        title="Profile couldn’t be loaded"
        description="This profile couldn’t be loaded. Please try again."
        onRetry={() => {
          setLoadError(null);
          setLoadedUserId(null);
          setRetryCount((count) => count + 1);
        }}
      />
    );
  }

  if (!userData) return null;

  const memberSince = userData.createdAt
    ? new Date(userData.createdAt).toLocaleDateString(undefined, {
        month: "short",
        year: "numeric",
      })
    : null;
  const stats = [
    { label: "Projects", value: projects.length },
    { label: "Applications", value: userData.Myapplications?.length ?? 0 },
    { label: "Skills", value: userData.skills?.length ?? 0 },
  ];
  const socialLinks = [
    {
      label: "GitHub",
      value: userData.github,
      icon: Code2,
      getUrl: getGitHubUrl,
    },
    {
      label: "Portfolio",
      value: userData.portfolio,
      icon: Link2,
      getUrl: getExternalUrl,
    },
  ];

  return (
    <main className="mx-auto w-full max-w-3xl px-1 py-4 pb-24 sm:px-4 sm:py-8 sm:pb-8">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-3 inline-flex min-h-9 items-center gap-1.5 rounded-full border border-[#E4E1D9] bg-white px-3.5 text-sm font-medium text-[#3D3A44] transition hover:bg-[#F7F6F2]"
      >
        <ArrowLeft size={15} />
        Back
      </button>

      <article className="overflow-hidden rounded-2xl border border-[#EAE8E2] bg-white shadow-sm">
        <div
          aria-hidden="true"
          className="h-20 bg-gradient-to-r from-[#3048E8] to-[#8FA2FF] sm:h-24"
        />
        <div className="-mt-10 px-4 pb-5 sm:-mt-11 sm:px-6 sm:pb-6">
          <div className="flex h-[76px] w-[76px] items-center justify-center overflow-hidden rounded-full border-[4px] border-white bg-[#3048E8] text-xl font-bold text-white shadow-sm sm:h-[84px] sm:w-[84px] sm:text-2xl">
            {userData.profile ? (
              <img
                src={userData.profile}
                alt={`${userData.name || "User"} profile`}
                className="h-full w-full object-cover"
              />
            ) : (
              userData.name?.charAt(0)?.toUpperCase() || <UserRound size={30} />
            )}
          </div>

          <div className="mt-3">
            <h1 className="break-words text-2xl font-bold tracking-tight text-[#16151A] sm:text-[28px]">
              {userData.name || "Unnamed member"}
            </h1>
            <p className="mt-0.5 break-words text-sm text-[#6B6872]">
              {[userData.career, userData.college, userData.year && `Class of ${userData.year}`]
                .filter(Boolean)
                .join(" · ") || "Student builder"}
            </p>
            {userData.status && (
              <span className="mt-2 inline-flex rounded-full bg-[#E8F5EC] px-2.5 py-1 text-xs font-semibold text-[#24733A]">
                {userData.status}
              </span>
            )}
          </div>

          {userData.bio && (
            <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-[#3D3A44]">
              {userData.bio}
            </p>
          )}

          <div className="mt-3 flex flex-wrap gap-2">
            {userData.email && (
              <a
                href={`mailto:${userData.email}`}
                className="inline-flex min-h-8 max-w-full items-center gap-1.5 rounded-full border border-[#EAE8E2] bg-white px-3 text-xs font-semibold text-[#3D3A44] transition hover:border-[#3048E8] hover:text-[#3048E8]"
              >
                <Mail size={14} />
                <span className="break-all">{userData.email}</span>
              </a>
            )}
            {socialLinks.map(({ label, value, icon: Icon, getUrl }) => {
              const externalUrl = value ? getUrl(value) : null;
              if (!value) return null;
              const content = (
                <>
                  <Icon size={14} />
                  <span className="shrink-0">{label}</span>
                  <span className="max-w-[200px] break-all">
                    {externalUrl
                      ? externalUrl.replace(/^https?:\/\//, "")
                      : value}
                  </span>
                  {externalUrl && <ExternalLink size={12} />}
                </>
              );
              return (
                externalUrl ? (
                  <a
                    key={label}
                    href={externalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-8 max-w-full items-center gap-1.5 rounded-full border border-[#EAE8E2] bg-white px-3 text-xs font-semibold text-[#3048E8] transition hover:border-[#3048E8]"
                  >
                    {content}
                  </a>
                ) : (
                  <span
                    key={label}
                    className="inline-flex min-h-8 max-w-full items-center gap-1.5 rounded-full border border-[#EAE8E2] bg-white px-3 text-xs font-semibold text-[#3048E8]"
                  >
                    {content}
                  </span>
                )
              );
            })}
            {!userData.github && (
              <span className="inline-flex min-h-8 items-center gap-1.5 rounded-full border border-dashed border-[#EAE8E2] px-3 text-xs text-[#77747C]">
                <Code2 size={14} />
                GitHub profile not added
              </span>
            )}
          </div>

          <div className="mt-4 grid gap-2 min-[400px]:grid-cols-2">
            <Link
              to="/explore"
              className="inline-flex min-h-10 items-center justify-center rounded-lg bg-[#3048E8] px-4 text-sm font-semibold text-white transition hover:bg-[#263FC5]"
            >
              Explore projects
            </Link>
            {userData.email ? (
              <a
                href={`mailto:${userData.email}`}
                className="inline-flex min-h-10 items-center justify-center rounded-lg border border-[#E4E1D9] bg-white px-4 text-sm font-semibold text-[#25232A] transition hover:bg-[#F7F6F2]"
              >
                Message
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="inline-flex min-h-10 items-center justify-center rounded-lg border border-[#E4E1D9] bg-white px-4 text-sm font-semibold text-[#77747C] disabled:cursor-not-allowed"
              >
                Message unavailable
              </button>
            )}
          </div>
        </div>
      </article>

      <dl className="mt-3 grid grid-cols-3 gap-2 sm:mt-4 sm:gap-3">
        {stats.map(({ label, value }) => (
          <div
            key={label}
            className="rounded-2xl border border-[#EAE8E2] bg-white px-2 py-3 text-center sm:py-3.5"
          >
            <dt className="mt-0.5 text-xs text-[#77747C] sm:text-sm">
              {label}
            </dt>
            <dd className="text-xl font-bold leading-6 text-[#25232A] sm:text-2xl">
              {value}
            </dd>
          </div>
        ))}
      </dl>

      {userData.skills?.length ? (
        <section className="mt-5" aria-labelledby="skills-heading">
          <h2
            id="skills-heading"
            className="text-base font-semibold text-[#25232A]"
          >
            Skills
          </h2>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {userData.skills.map((skill) => (
              <li
                key={skill}
                className="rounded-md bg-[#EAE8E2] px-2 py-1 text-xs font-medium text-[#4C4952]"
              >
                {skill}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-5" aria-labelledby="projects-heading">
        <div className="mb-2 flex items-center justify-between gap-3">
          <h2
            id="projects-heading"
            className="text-base font-semibold text-[#25232A]"
          >
            Projects
          </h2>
          {memberSince && (
            <p className="flex shrink-0 items-center gap-1.5 text-xs text-[#77747C]">
              <CalendarDays size={14} />
              Joined {memberSince}
            </p>
          )}
        </div>
        {projectsError ? (
          <div
            role="alert"
            className="rounded-2xl border border-[#E4E1D9] bg-white px-4 py-6 text-center"
          >
            <p className="text-sm text-[#5C5964]">{projectsError}</p>
            <button
              type="button"
              onClick={() => setRetryCount((count) => count + 1)}
              className="mt-2 text-sm font-semibold text-[#3048E8] hover:underline"
            >
              Try again
            </button>
          </div>
        ) : projects.length ? (
          <ul className="space-y-2">
            {projects.map((project) => (
              <li key={project._id}>
                <Link
                  to={`/project-info/${project._id}`}
                  className="flex min-w-0 items-center gap-3 rounded-2xl border border-[#EAE8E2] bg-white p-2.5 transition hover:border-[#C6CEFF] hover:shadow-sm sm:p-3"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#3048E8] to-[#8FA2FF] text-lg font-bold text-white">
                    {project.title?.charAt(0)?.toUpperCase() || (
                      <FolderKanban size={20} />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-[#25232A]">
                      {project.title}
                    </span>
                    <span className="mt-0.5 block line-clamp-2 text-xs leading-5 text-[#77747C]">
                      {project.description || "A project by this community member."}
                    </span>
                  </span>
                  <ExternalLink
                    size={15}
                    className="shrink-0 text-[#77747C]"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-2xl border border-dashed border-[#DAD7CF] bg-white/70 px-4 py-6 text-center text-sm text-[#77747C]">
            No projects shared yet.
          </p>
        )}
      </section>
    </main>
  );
}
