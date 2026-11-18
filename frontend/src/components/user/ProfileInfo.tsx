interface ProfileInfoProps {
  type: string;
  count: number;
}

const ProfileInfo = ({ type, count }: ProfileInfoProps) => {
  return (
    <div
      className="flex w-full min-w-0 items-center justify-center rounded-[12px] border border-[#E4E1D9] bg-white px-2 py-2"
    >
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-lg font-bold leading-5">{count ?? 0}</span>

        <span className="text-[10px] text-[#5C5964] text-center">
          {type || "Empty"}
        </span>
      </div>
    </div>
  );
};

export default ProfileInfo;
