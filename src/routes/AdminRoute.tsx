import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

function AdminRoute(){
    const {user, loading} = useAuth();

    if(loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }

        if(!user){
            return <Navigate to ="/login" replace/>;
        }
        if(user.role !== "Admin"){
            return <Navigate to="/" replace/>
        }

        return <Outlet/>;
        
    }
    export default AdminRoute;