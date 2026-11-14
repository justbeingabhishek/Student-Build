
import { NavLink } from 'react-router-dom'

const SlideBar = () => {

    const links = [
        {
            name : "Home",
            route : "/"
        },
        {
            name : "Explore",
            route : "/explore"
        },
        {
            name : "Post",
            route : "/post"
        },
        {
            name : "Alert",
            route : "/alert"
        },
        {
            name : "Profile",
            route : "/profile"
        },
        {
            name : "My Projects",
            route : "/my-projects"
        },
        {
            name : "My Applications",
            route : "/my-applications"
        },

    ]

  return (
    <div className='h-full hidden w-[25%] md:flex flex-col gap-10 border-r border-gray-300 py-8 px-6  '>
        <div className='text-xl font-bold text-black'>
            DevCircle
        </div>
        <div className='flex flex-col gap-4 '>
      {
            links.map((data)=>{
                return <NavLink to={data.route} className='font-medium cursor-pointer text-[#3D3A44] hover:bg-[#EEF1FF] px-4 py-2 rounded-md'>{data.name}</NavLink>
            })
        }
        </div>
  
    </div>
  )
}

export default SlideBar