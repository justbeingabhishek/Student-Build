import { useNavigate } from "react-router-dom"

const RoleCard = () => {

const navigate = useNavigate();

    
  return (
    <div className="bg-white border border-[#E4E1D9] flex items-center rounded-[14px] py-3 px-4">
        <div className="w-full flex justify-between items-center">
            <span className="text-[14px] font-bold">UI/UX Designer</span>
            <button onClick={()=> navigate('/apply')} className="bg-[#2F4BE0] text-white px-4 text-[14px] min-h-11 rounded-[10px] ">Apply</button>
            {/* <button className="bg-white text-[#16151A] border border-[#DAD7CF] px-4 text-[14px] min-h-11 ">Applied</button>
            <button className="bg-white text-[#16151A] border border-[#DAD7CF] px-4 text-[14px] min-h-11 ">Your Project</button> */}
        </div>
    </div>
  )
}

export default RoleCard