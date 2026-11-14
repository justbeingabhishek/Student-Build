import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Explore from "./pages/Explore"
import Post from "./pages/Post"
import Alert from "./pages/Alert"
import Profile from "./pages/Profile"
import MyProjects from "./pages/MyProjects"
import MyApplications from "./pages/MyApplications"
import UserLayout from "./layout/UserLayout"

const App = () => {
  return (
    <div className="">
      <Routes>
        <Route path="/" element={<UserLayout/> }>
        <Route index element={<Home/> }/>
        <Route path="explore" element={<Explore/>} />
        <Route path="post" element={<Post/>} />
        <Route path="alert" element={<Alert/>} />
        <Route path="profile" element = {<Profile/>}/>
        <Route path="my-projects" element={<MyProjects/>} />
        <Route path="my-applications" element={<MyApplications/>}/>
       </Route>
      </Routes>
    </div>
  )
}

export default App