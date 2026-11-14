interface ProfileInfoProps {
  type: string;
  count: number;
}

const ProfileInfo = ({ type, count }: ProfileInfoProps) => {
  return (
    <div className="bg-white border border-[#E4E1D9] 
                    w-full min-w-0 rounded-[14px] 
                    p-3 sm:p-4 
                    flex justify-center items-center">

      <div className="flex flex-col items-center gap-1">
        <span className="text-xl sm:text-2xl font-bold">
          {count ?? 0}
        </span>

        <span className="text-xs sm:text-[13px] text-[#5C5964] text-center">
          {type || "Empty"}
        </span>
      </div>

    </div>
  );
};

export default ProfileInfo;