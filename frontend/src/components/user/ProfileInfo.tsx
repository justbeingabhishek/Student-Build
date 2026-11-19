interface ProfileInfoProps {
  type: string;
  count: number;
}

const ProfileInfo = ({ type, count }: ProfileInfoProps) => {
  return (
    <p className="flex items-center gap-1.5 text-sm text-[#16151A]">
      <span className="font-bold">{count ?? 0}</span>
      <span className="text-[#5C5964]">{type || "Empty"}</span>
    </p>
  );
};

export default ProfileInfo;
