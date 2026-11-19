import { Globe2, Link2, Mail } from "lucide-react";
import { Link } from "react-router-dom";

interface ProfileCardUser {
  name?: string;
  profile?: string;
  college?: string;
  year?: number;
  bio?: string;
  github?: string;
  portfolio?: string;
  email?: string;
}

const getExternalUrl = (value?: string) => {
  if (!value) return null;

  try {
    const url = new URL(
      /^https?:\/\//i.test(value) ? value : `https://${value}`,
    );
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.href
      : null;
  } catch {
    return null;
  }
};

const getInitials = (name?: string) =>
  name
    ?.trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "U";

const ProfilePicture = ({ user }: { user: ProfileCardUser }) => {
  const githubUrl = getExternalUrl(user.github);
  const portfolioUrl = getExternalUrl(user.portfolio);
  const subtitle = [
    user.college,
    user.year ? `Class of ${user.year}` : undefined,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <section className="border-b border-[#E4E1D9] pb-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-10">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#DAD7CF] bg-[#2F4BE0] text-2xl font-bold text-white sm:ml-8 sm:h-32 sm:w-32">
          {user.profile ? (
            <img
              src={user.profile}
              alt={`${user.name || "User"} profile`}
              className="h-full w-full object-cover"
            />
          ) : (
            getInitials(user.name)
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h1 className="break-words text-2xl font-normal leading-tight text-[#16151A] sm:text-3xl">
            {user.name || "Your name"}
          </h1>
          {subtitle && (
            <p className="mt-2 text-sm leading-6 text-[#5C5964]">{subtitle}</p>
          )}
          {user.bio && (
            <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-[#3D3A44]">
              {user.bio}
            </p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex max-w-full items-center gap-1.5 font-medium text-[#2F4BE0] hover:underline"
              >
                <Link2 size={15} className="shrink-0" />
                <span className="truncate">
                  {user.github?.replace(/^https?:\/\//i, "").replace(/\/$/, "")}
                </span>
              </a>
            )}

            {portfolioUrl ? (
              <a
                href={portfolioUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex max-w-full items-center gap-1.5 font-medium text-[#2F4BE0] hover:underline"
              >
                <Globe2 size={15} className="shrink-0" />
                <span className="truncate">
                  {user.portfolio?.replace(/^https?:\/\//i, "").replace(/\/$/, "")}
                </span>
              </a>
            ) : (
              <Link
                to="/edit-info"
                className="inline-flex items-center gap-1.5 text-[#5C5964] hover:text-[#16151A]"
              >
                <Globe2 size={15} />
                Add portfolio
              </Link>
            )}

            {user.email && (
              <a
                href={`mailto:${user.email}`}
                className="inline-flex max-w-full items-center gap-1.5 text-[#5C5964] hover:text-[#16151A]"
              >
                <Mail size={15} className="shrink-0" />
                <span className="truncate">{user.email}</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePicture;
