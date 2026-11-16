import { useContext, useEffect, useState } from "react";
import api from "../../Services/api";
import Card from "../components/user/Card";
import { userContext } from "../context/UserContext";

const Home = () => {

  const {projects,setProjcts} = useContext(userContext) as any;

  


  return (
    <div className="h-full w-full flex py-3 flex-col  pb-20  gap-8">
      <div>
        <h2 className="font-semibold text-2xl">Lookig for team</h2>
      </div>
      <div className="flex items-center flex-col gap-8">
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4">
            <h2 className="text-lg font-semibold text-[#3D3A44]"> No projects found</h2>
            <p className="text-sm text-[#5C5964]">Create a project to find teammates</p>
          </div>
        ) : ( 
          projects.map((project: any) => (
            <Card key={project._id} project={project} />
          ))
  )}
      </div>
    </div>
  );
};


export default Home;
