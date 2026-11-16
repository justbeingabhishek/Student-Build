import { useContext } from "react"
import { userContext } from "../../context/UserContext"

const TeamMates = ({data} : any) => {
  const {user} : any = useContext(userContext);
  return (
          <div className="flex items-center gap-2.5 mt-2.5">
            <div className="h-10 w-10 bg-[#2F4BE0] text-white uppercase rounded-full flex justify-center items-center text-[14px] font-bold shrink-0">
                {user?.name.slice(0,2)}
            </div>
            <span className="text-[14px] text-[#16151A] font-medium">{data?.name} {user?._id==data?.id ? "(owner)" : ""}</span>
        </div>
  )
}

export default TeamMates