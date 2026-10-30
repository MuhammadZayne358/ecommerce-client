// import { useState } from "react";
// import type { FormEvent } from "react";
// import { useAuth } from "../../context/AuthContext";
// import { Link, useNavigate } from "react-router-dom";

// function Login(){
//     const { login } = useAuth();
//     const [email, setEmail] = useState("");
//     const navigate = useNavigate();
//   const [password, setPassword] = useState("");

//     const [loading, setloading] = useState(false);
//     const [error, setError]  = useState("");

//     const handleSubmit = async (e: FormEvent) =>{
//         e.preventDefault();
        
//         setError("");
//         setloading(true);
        
//         try {
//            await login(email, password);

//            navigate("/");
//         } catch (error: any) {
//           setError(
//             error.response?.data?.message ??
//             "Login failed."
//           );
//         } finally {
//           setloading(false);
//         }
//       };

                
            
           

//     return(

//     <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
//       <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">

//         <h1 className="mb-2 text-3xl font-bold text-gray-900">
//           Welcome Back
//         </h1>

//         <p className="mb-6 text-gray-500">
//           Login to your account
//         </p>

//         {error && (
//           <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
//             {error}
//           </div>
//         )}

//         <form
//          onSubmit={handleSubmit}
//           className="space-y-5"
//         >
//           <div>
//             <label className="mb-1 block text-sm font-medium">
//               Email
//             </label>

//             <input
//               type="email"
//               value={email}
//               onChange={(e) =>
//                 setEmail(e.target.value)
//               }
//               required
//               className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
//               placeholder="you@example.com"
//             />
//           </div>

//           <div>
//             <label className="mb-1 block text-sm font-medium">
//               Password
//             </label>

//             <input
//               type="password"
//               value={password}
//               onChange={(e) => {
//                 setPassword(e.target.value);
//               }}
//               required
//               className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
//               placeholder="••••••••"
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full rounded-lg bg-black px-4 py-3 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
//           >
//             {loading 
//             ? "Logging in..." 
//             : "Login"}
//            </button>
//         </form>
//         <p className="mt-6 text-center text-sm text-gray-500">
//   Don't have an account?{" "}
//   <Link
//     to="/register"
//     className="font-semibold text-black hover:underline"
//   >
//     Create Account
//   </Link>
// </p>
//       </div>
//     </div>
    
//   );
// }

// export default Login;

import AuthPage from "./AuthPage";

function Login() {
  return <AuthPage initialMode="login" />;
}

export default Login;