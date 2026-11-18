import { AlertCircle, Inbox, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

export const LoadingState = ({ label = "Loading..." }: { label?: string }) => (
  <div
    role="status"
    className="flex min-h-56 w-full flex-col items-center justify-center gap-3 text-sm text-[#77747C]"
  >
    <span className="h-7 w-7 animate-spin rounded-full border-2 border-[#DAD7CF] border-t-[#2F4BE0]" />
    {label}
  </div>
);

export const EmptyState = ({
  title,
  description,
  actionLabel,
  actionTo,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  actionTo?: string;
}) => (
  <section className="mx-auto flex min-h-64 w-full max-w-xl flex-col items-center justify-center rounded-2xl border border-dashed border-[#DAD7CF] bg-white px-6 py-10 text-center">
    <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#EEF1FF] text-[#2F4BE0]">
      <Inbox size={23} />
    </span>
    <h2 className="text-base font-semibold text-[#16151A]">{title}</h2>
    <p className="mt-1.5 max-w-md text-sm leading-6 text-[#77747C]">
      {description}
    </p>
    {actionLabel && actionTo && (
      <Link
        to={actionTo}
        className="mt-5 rounded-lg bg-[#2F4BE0] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#263FC5]"
      >
        {actionLabel}
      </Link>
    )}
  </section>
);

export const ErrorState = ({
  title = "We couldn’t load this page",
  description = "Check your connection and try again.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry: () => void;
}) => (
  <section className="mx-auto flex min-h-64 w-full max-w-xl flex-col items-center justify-center rounded-2xl border border-[#F0C4BF] bg-white px-6 py-10 text-center">
    <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFF1EF] text-[#B42318]">
      <AlertCircle size={23} />
    </span>
    <h2 className="text-base font-semibold text-[#16151A]">{title}</h2>
    <p className="mt-1.5 max-w-md text-sm leading-6 text-[#77747C]">
      {description}
    </p>
    <button
      type="button"
      onClick={onRetry}
      className="mt-5 inline-flex items-center gap-2 rounded-lg border border-[#DAD7CF] bg-white px-4 py-2.5 text-sm font-semibold text-[#3D3A44] transition hover:bg-[#F7F6F2]"
    >
      <RefreshCw size={15} />
      Try again
    </button>
  </section>
);
