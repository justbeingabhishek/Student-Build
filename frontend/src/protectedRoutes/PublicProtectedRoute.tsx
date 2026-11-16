import { Navigate } from "react-router-dom";

const PublicProtectedRoute = ({children , user} : {children: React.ReactNode; user: any}) => {
  if(user === null){
    return <Navigate to="/login" replace={true} />
  }
  return <>{children}</>
}

export default PublicProtectedRoute