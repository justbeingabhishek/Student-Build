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
    <section className="overflow-hidden rounded-[14px] border border-[#E4E1D9] bg-white">
      <div className="h-14 bg-gradient-to-r from-[#2F4BE0] to-[#8FA2FF]" />

      <div className="px-3 pb-3">
        <div className="-mt-8 mb-2 flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-[#2F4BE0] text-lg font-bold text-white">
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

        <h1 className="text-lg font-semibold leading-6 text-[#16151A]">
          {user.name || "Your name"}
        </h1>
        {subtitle && (
          <p className="text-xs text-[#5C5964]">{subtitle}</p>
        )}
        {user.bio && (
          <p className="mt-1.5 text-sm text-[#16151A]">{user.bio}</p>
        )}

        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-[#E4E1D9] px-2.5 py-1 text-[11px] text-[#2F4BE0] hover:bg-[#F4F5FF]"
            >
              <Link2 size={12} />
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
              className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-[#E4E1D9] px-2.5 py-1 text-[11px] text-[#2F4BE0] hover:bg-[#F4F5FF]"
            >
              <Globe2 size={12} />
              <span className="truncate">
                {user.portfolio?.replace(/^https?:\/\//i, "").replace(/\/$/, "")}
              </span>
            </a>
          ) : (
            <Link
              to="/edit-info"
              className="inline-flex items-center gap-1 rounded-full border border-dashed border-[#DAD7CF] px-2.5 py-1 text-[11px] text-[#5C5964] hover:bg-[#F7F6F2]"
            >
              + Add portfolio
            </Link>
          )}

          {user.email && (
            <a
              href={`mailto:${user.email}`}
              className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-[#E4E1D9] px-2.5 py-1 text-[11px] text-[#2F4BE0] hover:bg-[#F4F5FF]"
            >
              <Mail size={12} />
              <span className="truncate">{user.email}</span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProfilePicture;
