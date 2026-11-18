interface ProfileInfoProps {
  type: string;
  count: number;
}

const ProfileInfo = ({ type, count }: ProfileInfoProps) => {
  return (
    <div
      className="flex min-h-24 w-full min-w-0 items-center justify-center rounded-2xl border border-[#E4E1D9] bg-white px-3 py-4 shadow-sm sm:min-h-28"
    >
      <div className="flex flex-col items-center gap-1">
        <span className="text-2xl font-bold leading-7 text-[#16151A] sm:text-3xl">
          {count ?? 0}
        </span>

        <span className="text-xs font-medium text-center text-[#5C5964] sm:text-sm">
          {type || "Empty"}
        </span>
      </div>
    </div>
  );
};

export default ProfileInfo;
