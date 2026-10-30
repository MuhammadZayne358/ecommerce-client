import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-ivory">
      <Navbar />

      <main className="flex flex-1 items-center justify-center">
        <Outlet />
      </main>
    </div>
  );
}

export default AuthLayout;