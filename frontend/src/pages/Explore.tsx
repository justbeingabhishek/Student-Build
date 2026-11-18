import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import Card from "../components/user/Card";
import api from "../../Services/api";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "../components/error/PageState";

interface ExploreProject {
  _id: string;
  category: string;
}

const Explore = () => {
  const filter = ["All", "Web", "Mobile", "AI/ML", "Desgin"];

  const [select, setSelect] = useState("All");
  const [input , setInput] = useState("Web");
  const [searchResult,setSearchResult] = useState<ExploreProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);




  const filteredProjects = select === "All" ? searchResult : 
  searchResult.filter((project) => project.category === select);



  useEffect(()=>{
    const timer = setTimeout(async()=>{
      console.log("request done  : ");
      try {
        const response = await api.get(`/projects/search/project?search=${input}`);
        setSearchResult(response.data.project)
      } catch (error) {
        setSearchResult([]);
        if (!isAxiosError(error) || error.response?.status !== 404) {
          setError("Unable to search projects. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    },500)

    return ()=>{
      clearTimeout(timer);
    }

  },[input, retryCount])

  const handleSearchChange = (value: string) => {
    setInput(value);
    setLoading(true);
    setError(null);
  };

  return (
    <div className="h-full w-full flex py-3 flex-col  pb-20  gap-8">
      <div>
        <h2 className="font-semibold text-2xl">Explore</h2>
      </div>

      {/* input */}

      <div>
        <input
        onChange={(e)=> handleSearchChange(e.target.value)}
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
        {error ? (
          <ErrorState
            title="Projects couldn’t be loaded"
            description={error}
            onRetry={() => {
              setLoading(true);
              setError(null);
              setRetryCount((count) => count + 1);
            }}
          />
        ) : loading ? (
          <LoadingState label="Searching projects..." />
        ) : filteredProjects.length === 0 ? (
          <EmptyState
            title={
              searchResult.length === 0
                ? "No projects found"
                : "No projects in this category"
            }
            description="Try another search or choose a different category."
          />
        ) : (
          filteredProjects.map((project) => (
            <Card key={project._id} project={project} />
          ))
        )}
      </div>
    </div>
  );
};

export default Explore;
