import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { isAxiosError } from "axios";
import api from "../../Services/api";

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
  MyProjects?: string[];
  SavedProject?: string[];
};

const getExternalUrl = (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.href
      : null;
  } catch {
    return null;
  }
};

export default function UserProfile() {
  const id = useParams().id;

  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    //fetch user data based on the id from the url
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/users/${id}`);
        setUserData(response.data.user);
      } catch (error: unknown) {
        console.error("Error fetching user data:", error);
        setError(
          isAxiosError<{ message?: string }>(error)
            ? error.response?.data?.message ||
                "Unable to load your profile. Please try again."
            : error instanceof Error
              ? error.message
              : "Something went wrong.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [id]);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            Account
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Your profile
          </h1>
          <p className="mt-2 text-slate-600">
            Your personal information in one place.
          </p>
        </header>

        {loading && (
          <div
            role="status"
            className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <span className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
            <div>
              <p className="font-semibold text-slate-900">
                Loading your profile
              </p>
              <p className="mt-1 text-sm text-slate-500">Just a moment…</p>
            </div>
          </div>
        )}

        {!loading && error && (
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800 shadow-sm"
          >
            <h2 className="font-semibold">We couldn’t load your profile</h2>
            <p className="mt-1 text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && userData && (
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-8 text-white sm:px-8">
              <div className="flex flex-wrap items-center gap-5">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/20 text-2xl font-bold ring-4 ring-white/20">
                  {userData.profile ? (
                    <img
                      src={userData.profile}
                      alt={`${userData.name || "User"} profile`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    userData.name?.charAt(0)?.toUpperCase() || "U"
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">
                    {userData.name || "Unnamed user"}
                  </h2>
                  {userData.career && (
                    <p className="mt-1 text-indigo-100">{userData.career}</p>
                  )}
                  {userData.status && (
                    <span className="mt-2 inline-flex rounded-full bg-white/15 px-3 py-1 text-sm text-white">
                      {userData.status}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-8 p-6 sm:p-8">
              <section aria-labelledby="details-heading">
                <h3
                  id="details-heading"
                  className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500"
                >
                  About
                </h3>
                <dl className="grid gap-4 sm:grid-cols-2">
                  {[
                    ["Email", userData.email],
                    ["College", userData.college],
                    ["Career", userData.career],
                    ["Year", userData.year ? String(userData.year) : undefined],
                    ["Status", userData.status],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-xl bg-slate-50 p-4">
                      <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        {label}
                      </dt>
                      <dd className="mt-2 break-words font-medium text-slate-900">
                        {value || "Not provided"}
                      </dd>
                    </div>
                  ))}
                  <div className="rounded-xl bg-slate-50 p-4 sm:col-span-2">
                    <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Bio
                    </dt>
                    <dd className="mt-2 whitespace-pre-wrap break-words font-medium text-slate-900">
                      {userData.bio || "No bio added"}
                    </dd>
                  </div>
                </dl>
              </section>

              <section aria-labelledby="skills-heading">
                <h3
                  id="skills-heading"
                  className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500"
                >
                  Skills
                </h3>
                {userData.skills?.length ? (
                  <ul className="flex flex-wrap gap-2">
                    {userData.skills.map((skill) => (
                      <li
                        key={skill}
                        className="rounded-full bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700"
                      >
                        {skill}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-500">No skills added</p>
                )}
              </section>

              <section aria-labelledby="links-heading">
                <h3
                  id="links-heading"
                  className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500"
                >
                  Links
                </h3>
                <dl className="grid gap-4 sm:grid-cols-2">
                  {[
                    ["GitHub", userData.github],
                    ["Portfolio", userData.portfolio],
                  ].map(([label, value]) => {
                    const externalUrl = value ? getExternalUrl(value) : null;
                    return (
                      <div key={label} className="rounded-xl bg-slate-50 p-4">
                        <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                          {label}
                        </dt>
                        <dd className="mt-2 break-all font-medium">
                          {value ? (
                            externalUrl ? (
                              <a
                                href={externalUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-indigo-700 underline decoration-indigo-300 underline-offset-2 hover:text-indigo-900"
                              >
                                {value}
                              </a>
                            ) : (
                              <span className="text-slate-900">{value}</span>
                            )
                          ) : (
                            <span className="text-slate-500">Not provided</span>
                          )}
                        </dd>
                      </div>
                    );
                  })}
                </dl>
              </section>

              <section aria-labelledby="activity-heading">
                <h3
                  id="activity-heading"
                  className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500"
                >
                  Activity
                </h3>
                <dl className="grid gap-4 sm:grid-cols-2">
                  {[
                    ["Projects", userData.MyProjects?.length],
                    ["Applications", userData.Myapplications?.length],
                    ["Saved projects", userData.SavedProject?.length],
                    [
                      "Member since",
                      userData.createdAt
                        ? new Date(userData.createdAt).toLocaleDateString()
                        : undefined,
                    ],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-xl bg-slate-50 p-4">
                      <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        {label}
                      </dt>
                      <dd className="mt-2 break-words font-medium text-slate-900">
                        {value ?? "Not provided"}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
