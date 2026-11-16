const ProfilePicture = ({user}: any) => {
  return (
    <div className='w-full py-4 flex bg-white rounded-[14px] border-[#E4E1D9]  px-2 border  items-center gap-2'>
        <div className='h-16 w-16 shrink-0 flex items-center justify-center rounded-full bg-[#2F4BE0] text-[22px] font-bold text-white'>
            {user.profile ? <img src={user.profile} alt="Profile" className="h-full w-full rounded-full object-cover" /> : user.name.slice(0, 2).toUpperCase()}
        </div>
        <div className='flex flex-col'>
            <span className="text-[22px] font-semibold">{user.name}</span>
            <span className="text-[14px] text-[#16151A] ">Full stack student building tools for campus Life.</span>
        </div>
    </div>
  )
}

export default ProfilePicture