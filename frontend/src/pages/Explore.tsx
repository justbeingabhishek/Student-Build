import { useState } from "react";
import Card from "../components/user/Card";

const Explore = () => {
  const filter = ["All", "Web", "Mobile", "AI/ML", "Desgin"];

  const [select, setSelect] = useState("All");

  return (
    <div className="h-full w-full flex py-5 flex-col  pb-20  gap-8">
      <div>
        <h2 className="font-semibold text-2xl">Explore</h2>
      </div>

      {/* input */}

      <div>
        <input
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
        <Card />
        <Card />
        <Card />
        <Card />
      </div>
    </div>
  );
};

export default Explore;
