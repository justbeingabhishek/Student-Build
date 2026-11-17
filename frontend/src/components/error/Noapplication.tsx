
import { FileText, Users } from "lucide-react";

interface EmptyApplicationsProps {
  title?: string;
  description?: string;
}

const EmptyApplications = ({
  title = "No applications yet",
  description = "There are no applications for this project right now. When someone applies, their details will appear here.",
}: EmptyApplicationsProps) => {
  return (
    <div className="flex min-h-[350px] w-full flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-[#F7F6F2] px-6 py-12 text-center">

      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
        <FileText size={30} className="text-blue-600" />
      </div>

      <h2 className="text-xl font-semibold tracking-tight text-gray-900">
        {title}
      </h2>

      <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
        {description}
      </p>

      <div className="mt-6 flex items-center gap-2 rounded-full bg-gray-50 px-4 py-2 text-sm text-gray-500">
        <Users size={16} className="text-gray-400" />
        <span>Applications will appear here</span>
      </div>

    </div>
  );
};

export default EmptyApplications;
