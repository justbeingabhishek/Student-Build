import { useContext, useState } from "react";
import type { FormEvent } from "react";
import { isAxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "../../Services/api.ts";
import Back from "../components/ui/Back";
import { userContext } from "../context/UserContext";

interface ProfileForm {
  name: string;
  college: string;
  year: string;
  bio: string;
  skills: string;
  github: string;
}

interface EditableUser {
  _id?: string;
  name?: string;
  college?: string;
  year?: number;
  bio?: string;
  skills?: string[];
  github?: string;
}

const EditInfoForm = ({
  user,
  setUser,
}: {
  user: EditableUser;
  setUser: (user: EditableUser) => void;
}) => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<ProfileForm>({
    name: user.name ?? "",
    college: user.college ?? "",
    year: user.year ? String(user.year) : "",
    bio: user.bio ?? "",
    skills: user.skills?.join(", ") ?? "",
    github: user.github ?? "",
  });

  const updateField = (field: keyof ProfileForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const year = form.year.trim() ? Number(form.year) : 0;
    if (!Number.isInteger(year) || year < 0) {
      toast.error("Enter a valid non-negative year.");
      return;
    }

    setSaving(true);
    try {
      const response = await api.put(
        "/users/me",
        {
          name: form.name.trim(),
          college: form.college.trim(),
          year,
          bio: form.bio.trim(),
          skills: form.skills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean),
          github: form.github.trim(),
        },
        { withCredentials: true },
      );
      setUser(response.data.updatedUserProfile);
      toast.success("Profile updated successfully.");
      navigate("/profile");
    } catch (error: unknown) {
      const message = isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message
        : undefined;
      toast.error(message || "Unable to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-[#DAD7CF] bg-white px-3 py-3 text-sm text-[#16151A] outline-none transition focus:border-[#2F4BE0] focus:ring-2 focus:ring-[#2F4BE0]/15";
  const labelClass = "mb-2 block text-sm font-medium text-[#16151A]";

  return (
    <section className="mx-auto w-full max-w-2xl pb-24">
      <Back />
      <h1 className="mb-5 mt-5 text-2xl font-semibold text-[#16151A]">
        Edit profile
      </h1>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className={labelClass} htmlFor="name">
            Full name
          </label>
          <input
            className={inputClass}
            id="name"
            autoComplete="name"
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="college">
            College
          </label>
          <input
            className={inputClass}
            id="college"
            autoComplete="organization"
            value={form.college}
            onChange={(event) => updateField("college", event.target.value)}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="year">
            Year
          </label>
          <input
            className={inputClass}
            id="year"
            type="number"
            min="0"
            step="1"
            inputMode="numeric"
            value={form.year}
            onChange={(event) => updateField("year", event.target.value)}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="bio">
            Bio
          </label>
          <textarea
            className={`${inputClass} min-h-24 resize-y`}
            id="bio"
            rows={4}
            value={form.bio}
            onChange={(event) => updateField("bio", event.target.value)}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="skills">
            Skills
          </label>
          <input
            className={inputClass}
            id="skills"
            value={form.skills}
            onChange={(event) => updateField("skills", event.target.value)}
            placeholder="React, Node.js, TypeScript"
          />
          <p className="mt-1.5 text-xs text-[#6B6872]">
            Separate each skill with a comma.
          </p>
        </div>

        <div>
          <label className={labelClass} htmlFor="github">
            GitHub profile
          </label>
          <input
            className={inputClass}
            id="github"
            type="url"
            autoComplete="url"
            value={form.github}
            onChange={(event) => updateField("github", event.target.value)}
            placeholder="https://github.com/username"
          />
        </div>

        <button
          className="w-full rounded-xl bg-[#2F4BE0] py-3 text-sm font-semibold text-white transition hover:bg-[#263FC5] disabled:cursor-not-allowed disabled:opacity-60"
          type="submit"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </form>
    </section>
  );
};

const EditInfo = () => {
  const context = useContext(userContext) as
    | {
        user: EditableUser | null;
        setUser: (user: EditableUser) => void;
      }
    | undefined;

  if (!context?.user) {
    return <p className="text-sm text-[#6B6872]">Loading profile...</p>;
  }

  return (
    <EditInfoForm
      key={context.user._id ?? context.user.name}
      user={context.user}
      setUser={context.setUser}
    />
  );
};

export default EditInfo;
