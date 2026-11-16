import { Navigate } from "react-router-dom";

const UserProtectedRoute = ({children , user} : {children: React.ReactNode; user: any}) => {
  if(!user){
    return <Navigate to="/login" replace={true} />
  }
  return <>{children}</>
}

export default UserProtectedRoute