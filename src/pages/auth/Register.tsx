// import { useState, type FormEvent } from "react";
// import { Link, useNavigate} from "react-router-dom";
// import { register } from "../../api/authApi";

// function Register () {
//   const naviagte = useNavigate();

//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleSubmit = async (e : FormEvent) => {
//     e.preventDefault();

//     setError("");
//     setLoading(true);
//     try{
//       await register ({
//         fullName,
//         email,
//         password,
//       });
//       naviagte("/login");
//     } catch (error : any){
//       setError(
//         error.response?.data?.message ??
//         "Registration failed."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };
// return (
//         <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">

//       <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">

//         <h1 className="mb-2 text-3xl font-bold">
//           Create Account
//         </h1>

//         <p className="mb-6 text-gray-500">
//           Create your customer account
//         </p>

//         {error && (
//           <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
//             {error}
//           </div>
//         )}

//         <form
//           onSubmit={handleSubmit}
//           className="space-y-5"
//         >

//           <div>
//             <label className="mb-1 block text-sm font-medium">
//               Full Name
//             </label>

//             <input
//               type="text"
//               value={fullName}
//               onChange={(e) => 
//                 setFullName(e.target.value)
//               }
//               required
//               className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
//               placeholder="John Doe"
//             />
//           </div>

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
//               placeholder="john@example.com"
//             />
//           </div>

//           <div>
//             <label className="mb-1 block text-sm font-medium">
//               Password
//             </label>

//             <input
//               type="password"
//               value={password}
//               onChange={(e) =>
//                 setPassword(e.target.value)
//               }
//               required
//               minLength={6}
//               className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
//               placeholder="••••••••"
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full rounded-lg bg-black px-4 py-3 font-semibold text-white hover:bg-gray-800 disabled:opacity-60"
//           >
//             {loading
//               ? "Creating Account..."
//               : "Create Account"}
//           </button>

//         </form>

//         <p className="mt-6 text-center text-sm text-gray-500">
//           Already have an account?{" "}
//           <Link
//             to="/login"
//             className="font-semibold text-black hover:underline"
//           >
//             Login
//           </Link>
//         </p>

//       </div>

//     </div>
//     )
//     }

// export default Register;


import AuthPage from "./AuthPage";

function Register() {
  return <AuthPage initialMode="register" />;
}

export default Register;