import { Outlet } from "react-router-dom";
import SlideBar from "../components/user/SlideBar.tsx";
import NvaigationBar from "../components/user/NvaigationBar.tsx";

const UserLayout = () => {
  return (
    <div className="flex md:flex-row flex-col min-h-screen w-full">
      <SlideBar />

      <main className="bg-[#F7F6F2] py-4 px-3 md:px-20  md:overflow-y-scroll min-h-screen md:h-screen w-full pb-10">
        <Outlet />
      </main>

      <NvaigationBar />
    </div>
  );
};

export default UserLayout;
