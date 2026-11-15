import ProjectCard from "../components/user/ProjectCard";

const MyProjects = () => {
  return (
    <div className="h-full w-full flex py-3 flex-col  pb-20  gap-8">
      <div>
        <h2 className="font-bold text-2xl tracking-[-0.02em]">My Projects</h2>
      </div>
      <div className="flex items-center flex-col gap-3.5">
        <ProjectCard />
        <ProjectCard />
        <ProjectCard />
        <ProjectCard />
      </div>
    </div>
  );
};

export default MyProjects;
