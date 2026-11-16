import { useEffect, useState } from "react";
import Card from "../components/user/Card";
import { userContext } from "../context/UserContext";
import { useContext } from "react";
import api from "../../Services/api";

const Explore = () => {
  const filter = ["All", "Web", "Mobile", "AI/ML", "Desgin"];

  const [select, setSelect] = useState("All");
  const [input , setInput] = useState("Web");
  const [searchResult,setSearchResult] = useState([]);




  const filteredProjects = select === "All" ? searchResult : 
  searchResult.filter((project: any) => project.category === select);



  useEffect(()=>{
    const timer = setTimeout(async()=>{
      console.log("request done  : ");
      try {
        const response = await api.get(`/projects/search/project?search=${input}`);
        setSearchResult(response.data.project)
      } catch (error) {
        setSearchResult([]);
        console.log("error : ");
      }
    },500)

    return ()=>{
      clearTimeout(timer);
    }

  },[input])


  return (
    <div className="h-full w-full flex py-3 flex-col  pb-20  gap-8">
      <div>
        <h2 className="font-semibold text-2xl">Explore</h2>
      </div>

      {/* input */}

      <div>
        <input
        onChange={(e)=> setInput(e.target.value)}
          placeholder="Search projects, stacks, roles"
          type="text"
          className="py-2 w-full border min-h-11 border-[#CFCCC3] rounded-xl px-3 "
        />
      </div>

      <div
        className="bar flex gap-2 text-[#16151A]
                overflow-x-auto md:overflow-visible
                flex-nowrap md:flex-wrap "
      >
        {filter.map((item, idx) => {
          return (
            <span
              key={idx}
              onClick={() => setSelect(item)}
              className={`border text-[#16151A] border-[#DAD7CF]  px-3 py-1.5 flex items-center justify-center text-[13px] min-h-9 rounded-2xl ${select == item ? "border border-[#16151A] bg-[#16151A] text-[#FFFFFF] " : ""} `}
            >
              {item}
            </span>
          );
        })}
      </div>

      <div className="flex items-center flex-col gap-8">
        {filteredProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4">
            <h2 className="text-lg font-semibold text-[#3D3A44]">
              {" "}
              No projects found
            </h2>
            <p className="text-sm text-[#5C5964]">
              Create a project to find teammates
            </p>
          </div>
        ) : (
          filteredProjects.map((project: any) => (
            <Card key={project._id} project={project} />
          ))
        )}
      </div>
    </div>
  );
};

export default Explore;
