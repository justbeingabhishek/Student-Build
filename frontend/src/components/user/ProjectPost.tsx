import { useState } from "react";
import type { FormEvent, MouseEvent } from "react";
import { isAxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { LoaderCircle, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import api from "../../../Services/api";

interface ProfileProject {
  _id: string;
  title: string;
  description: string;
  coverImage?: string;
  category?: string;
  teamSize?: string;
  techStack?: string[];
  rolesNeeded?: string[];
}

interface ProjectPostProps {
  project: ProfileProject;
  onUpdated: (project: ProfileProject) => void;
  onDeleted: (projectId: string) => void;
}

interface ProjectForm {
  title: string;
  description: string;
  tech: string;
  roles: string;
  teamSize: string;
}

const ProjectPost = ({ project, onUpdated, onDeleted }: ProjectPostProps) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dialog, setDialog] = useState<"edit" | "delete" | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState<ProjectForm>({
    title: project.title,
    description: project.description,
    tech: project.techStack?.join(", ") ?? "",
    roles: project.rolesNeeded?.join(", ") ?? "",
    teamSize: project.teamSize ?? "",
  });

  const gradient = project.coverImage;
  const from = gradient?.match(/from-\[(#[0-9A-Fa-f]{6})\]/)?.[1];
  const to = gradient?.match(/to-\[(#[0-9A-Fa-f]{6})\]/)?.[1];
  const cardBackground =
    from && to
      ? `linear-gradient(135deg, ${from}, ${to})`
      : "linear-gradient(135deg, #047857, #A7F3D0)";

  const stopPropagation = (event: MouseEvent) => event.stopPropagation();
  const updateForm = (field: keyof ProjectForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleEdit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    try {
      const response = await api.put(
        `/projects/${project._id}`,
        {
          title: form.title.trim(),
          description: form.description.trim(),
          tech: form.tech
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          roles: form.roles
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          teamSize: form.teamSize.trim(),
        },
        { withCredentials: true },
      );
      onUpdated(response.data.updatedProject);
      toast.success("Project updated successfully.");
      setDialog(null);
    } catch (error) {
      const message = isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message
        : undefined;
      toast.error(message || "Unable to update project.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/projects/${project._id}`, { withCredentials: true });
      onDeleted(project._id);
      toast.success("Project deleted.");
      setDialog(null);
    } catch (error) {
      const message = isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message
        : undefined;
      toast.error(message || "Unable to delete project.");
    } finally {
      setDeleting(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-[#DAD7CF] bg-white px-3 py-2.5 text-sm text-[#16151A] outline-none transition focus:border-[#2F4BE0] focus:ring-2 focus:ring-[#2F4BE0]/15";
  const labelClass = "mb-1.5 block text-sm font-medium text-[#3D3A44]";

  return (
    <>
      <article className="group relative z-0 aspect-square rounded-lg bg-white shadow-sm hover:z-20 focus-within:z-20 sm:rounded-xl">
        <button
          type="button"
          aria-label={`View ${project.title}`}
          onClick={() => navigate(`/project-info/${project._id}`)}
          className="absolute inset-0 h-full w-full overflow-hidden rounded-lg text-left outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-[#2F4BE0] sm:rounded-xl"
          style={{ background: cardBackground }}
        >
          <span className="absolute inset-0 bg-black/0 transition group-hover:bg-black/15 group-focus-visible:bg-black/15" />
          <span className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent p-3 pt-16 text-white sm:p-4 sm:pt-20">
            <span className="block truncate text-sm font-semibold sm:text-base">
              {project.title}
            </span>
            <span className="mt-1 block truncate text-[11px] text-white/85 sm:text-xs">
              {project.category || project.techStack?.slice(0, 3).join(" · ") || "Project"}
            </span>
          </span>
          <span className="absolute left-3 top-3 text-3xl font-extrabold tracking-tight text-white/35 sm:left-4 sm:top-4 sm:text-5xl">
            {project.title.slice(0, 2).toUpperCase()}
          </span>
        </button>

        <div className="absolute right-2 top-2 z-10" onClick={stopPropagation}>
          <button
            type="button"
            aria-label={`Project options for ${project.title}`}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur transition hover:bg-black/55 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          >
            <MoreHorizontal size={20} />
          </button>

          {menuOpen && (
            <div
              role="menu"
              aria-label={`${project.title} options`}
              className="absolute right-0 top-11 w-40 overflow-hidden rounded-xl border border-[#E4E1D9] bg-white py-1 shadow-xl"
            >
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  setForm({
                    title: project.title,
                    description: project.description,
                    tech: project.techStack?.join(", ") ?? "",
                    roles: project.rolesNeeded?.join(", ") ?? "",
                    teamSize: project.teamSize ?? "",
                  });
                  setDialog("edit");
                }}
                className="flex min-h-10 w-full items-center gap-2.5 px-3 text-left text-sm text-[#16151A] transition hover:bg-[#F7F6F2]"
              >
                <Pencil size={15} />
                Edit project
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  setDialog("delete");
                }}
                className="flex min-h-10 w-full items-center gap-2.5 px-3 text-left text-sm font-medium text-[#B42318] transition hover:bg-[#FFF7F6]"
              >
                <Trash2 size={15} />
                Delete project
              </button>
            </div>
          )}
        </div>
      </article>

      {dialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !saving && !deleting) {
              setDialog(null);
            }
          }}
        >
          {dialog === "delete" ? (
            <section
              role="alertdialog"
              aria-modal="true"
              aria-labelledby={`delete-title-${project._id}`}
              aria-describedby={`delete-description-${project._id}`}
              className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
              onClick={stopPropagation}
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#FFF1EF] text-[#B42318]">
                <Trash2 size={20} />
              </div>
              <h2
                id={`delete-title-${project._id}`}
                className="text-lg font-semibold text-[#16151A]"
              >
                Delete this project?
              </h2>
              <p
                id={`delete-description-${project._id}`}
                className="mt-2 text-sm leading-6 text-[#5C5964]"
              >
                “{project.title}” will be permanently deleted. This action
                cannot be undone.
              </p>
              <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  disabled={deleting}
                  onClick={() => setDialog(null)}
                  className="min-h-10 rounded-lg border border-[#DAD7CF] px-4 text-sm font-semibold text-[#3D3A44] transition hover:bg-[#F7F6F2] disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={deleting}
                  onClick={() => void handleDelete()}
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#B42318] px-4 text-sm font-semibold text-white transition hover:bg-[#912018] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {deleting && <LoaderCircle size={16} className="animate-spin" />}
                  {deleting ? "Deleting…" : "Delete project"}
                </button>
              </div>
            </section>
          ) : (
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby={`edit-title-${project._id}`}
              className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
              onClick={stopPropagation}
            >
              <h2
                id={`edit-title-${project._id}`}
                className="text-lg font-semibold text-[#16151A]"
              >
                Edit project
              </h2>
              <p className="mt-1 text-sm text-[#6B6872]">
                Update the details shown on your project post.
              </p>
              <form className="mt-5 space-y-4" onSubmit={handleEdit}>
                <div>
                  <label className={labelClass} htmlFor={`title-${project._id}`}>
                    Project title
                  </label>
                  <input
                    className={inputClass}
                    id={`title-${project._id}`}
                    required
                    value={form.title}
                    onChange={(event) => updateForm("title", event.target.value)}
                  />
                </div>
                <div>
                  <label
                    className={labelClass}
                    htmlFor={`description-${project._id}`}
                  >
                    Description
                  </label>
                  <textarea
                    className={`${inputClass} min-h-24 resize-y`}
                    id={`description-${project._id}`}
                    required
                    rows={3}
                    value={form.description}
                    onChange={(event) =>
                      updateForm("description", event.target.value)
                    }
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor={`tech-${project._id}`}>
                    Tech stack
                  </label>
                  <input
                    className={inputClass}
                    id={`tech-${project._id}`}
                    value={form.tech}
                    onChange={(event) => updateForm("tech", event.target.value)}
                    placeholder="React, TypeScript"
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor={`roles-${project._id}`}>
                    Roles needed
                  </label>
                  <input
                    className={inputClass}
                    id={`roles-${project._id}`}
                    value={form.roles}
                    onChange={(event) =>
                      updateForm("roles", event.target.value)
                    }
                    placeholder="Designer, Developer"
                  />
                </div>
                <div>
                  <label
                    className={labelClass}
                    htmlFor={`team-size-${project._id}`}
                  >
                    Team size
                  </label>
                  <input
                    className={inputClass}
                    id={`team-size-${project._id}`}
                    min="1"
                    required
                    type="number"
                    value={form.teamSize}
                    onChange={(event) =>
                      updateForm("teamSize", event.target.value)
                    }
                  />
                </div>
                <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => setDialog(null)}
                    className="min-h-10 rounded-lg border border-[#DAD7CF] px-4 text-sm font-semibold text-[#3D3A44] transition hover:bg-[#F7F6F2] disabled:opacity-60"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#2F4BE0] px-4 text-sm font-semibold text-white transition hover:bg-[#263FC5] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {saving && <LoaderCircle size={16} className="animate-spin" />}
                    {saving ? "Saving…" : "Save changes"}
                  </button>
                </div>
              </form>
            </section>
          )}
        </div>
      )}
    </>
  );
};

export default ProjectPost;
