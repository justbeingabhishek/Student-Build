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
    <section className="overflow-hidden rounded-2xl border border-[#E4E1D9] bg-white shadow-sm">
      <div className="h-24 bg-gradient-to-r from-[#2F4BE0] via-[#536BED] to-[#8FA2FF] sm:h-32" />

      <div className="px-4 pb-5 sm:px-6 sm:pb-6">
        <div className="-mt-11 mb-3 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-[#2F4BE0] text-2xl font-bold text-white shadow-sm sm:-mt-12 sm:h-24 sm:w-24">
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

        <h2 className="break-words text-2xl font-bold leading-tight tracking-tight text-[#16151A] sm:text-3xl">
          {user.name || "Your name"}
        </h2>
        {subtitle && (
          <p className="mt-1 text-sm leading-6 text-[#5C5964]">{subtitle}</p>
        )}
        {user.bio && (
          <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-6 text-[#3D3A44] sm:text-base">
            {user.bio}
          </p>
        )}

        <div className="mt-5 flex flex-col items-start gap-2 sm:flex-row sm:flex-wrap">
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-10 max-w-full items-center gap-2 rounded-full border border-[#E4E1D9] px-3 text-xs font-medium text-[#2F4BE0] transition hover:bg-[#F4F5FF] sm:text-sm"
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
              className="inline-flex min-h-10 max-w-full items-center gap-2 rounded-full border border-[#E4E1D9] px-3 text-xs font-medium text-[#2F4BE0] transition hover:bg-[#F4F5FF] sm:text-sm"
            >
              <Globe2 size={15} className="shrink-0" />
              <span className="truncate">
                {user.portfolio?.replace(/^https?:\/\//i, "").replace(/\/$/, "")}
              </span>
            </a>
          ) : (
            <Link
              to="/edit-info"
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-dashed border-[#DAD7CF] px-3 text-xs font-medium text-[#5C5964] transition hover:bg-[#F7F6F2] sm:text-sm"
            >
              + Add portfolio
            </Link>
          )}

          {user.email && (
            <a
              href={`mailto:${user.email}`}
              className="inline-flex min-h-10 max-w-full items-center gap-2 rounded-full border border-[#E4E1D9] px-3 text-xs font-medium text-[#2F4BE0] transition hover:bg-[#F4F5FF] sm:text-sm"
            >
              <Mail size={15} className="shrink-0" />
              <span className="truncate">{user.email}</span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProfilePicture;
