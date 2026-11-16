import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Post from "./pages/Post";
import Alert from "./pages/Alert";
import Profile from "./pages/Profile";
import MyProjects from "./pages/MyProjects";
import MyApplications from "./pages/MyApplications";
import UserLayout from "./layout/UserLayout";
import ProjectInfo from "./pages/ProjectInfo";
import Apply from "./pages/Apply";
import ReviewApplications from "./pages/ReviewApplications";
import Login from "./components/auth/login/Login";
import Signup from "./components/auth/register/Register";
import UserProtectedRoute from "./protectedRoutes/UserProtectedRoute";
import { useContext } from "react";
import { userContext } from "./context/UserContext";

const App = () => {
  const {user  , loading } : any = useContext(userContext);
  console.log("user : ",user);
  return (
      loading ? <span>Loading... </span> : 
      <div>
      <Routes>
        {/* common routes  */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />

        {/* user routes */}
        <Route path="/" element={<UserProtectedRoute user={user}><UserLayout /></UserProtectedRoute>}>
          <Route index element={<Home />} />
          <Route path="explore" element={<Explore />} />
          <Route path="post" element={<Post />} />
          <Route path="alert" element={<Alert />} />
          <Route path="profile" element={<Profile />} />
          <Route path="my-projects" element={<MyProjects />} />
          <Route path="my-applications" element={<MyApplications />} />
          <Route path="project-info/:id" element={<ProjectInfo />} />
          <Route path="apply" element={<Apply />} />
          <Route path="review-applications" element={<ReviewApplications />} />

          <Route path="*" element={<div>404 Not Found</div>} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
