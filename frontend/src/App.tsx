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
import EditInfo from "./pages/EditInfo";
import Login from "./components/auth/login/Login";
import Signup from "./components/auth/register/Register";
import UserProtectedRoute from "./protectedRoutes/UserProtectedRoute";
import UserProfile from "./pages/UserProfile";
import ForgotPassword from "./pages/ForgotPassword";
import { useContext } from "react";
import { userContext } from "./context/UserContext";
import { EmptyState } from "./components/error/PageState";

const App = () => {
  const context = useContext(userContext);
  const user = context?.user;
  const loading = context?.loading ?? true;
  console.log("user : ",user);
  return (
      loading ? <span>Loading... </span> : 
      <div>
      <Routes>
        {/* common routes  */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* user routes */}
        <Route path="/" element={<UserProtectedRoute user={user}><UserLayout /></UserProtectedRoute>}>
          <Route index element={<Home />} />
          <Route path="explore" element={<Explore />} />
          <Route path="post" element={<Post />} />
          <Route path="alert" element={<Alert />} />
          <Route path="profile" element={<Profile />} />
          <Route path="edit-info" element={<EditInfo />} />
          <Route path="my-projects" element={<MyProjects />} />
          <Route path="my-applications" element={<MyApplications />} />
          <Route path="project-info/:id" element={<ProjectInfo />} />
          <Route path="apply/:id" element={<Apply />} />
          <Route path="review-applications/:id" element={<ReviewApplications />} />
          <Route path="edit/info" element={<EditInfo/>}/>
          <Route path="user/:id" element={<UserProfile/>}/>

          <Route
            path="*"
            element={
              <EmptyState
                title="Page not found"
                description="The page you’re looking for doesn’t exist or has moved."
                actionLabel="Go to home"
                actionTo="/"
              />
            }
          />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
