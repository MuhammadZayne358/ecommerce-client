import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getCurrentUser } from "../api/authApi";
import {login as loginApi} from "../api/authApi";
import api from "../api/axios";

export interface User {
    userId : number,
    fullName : string,
    email : string,
    role : string,
}

interface AuthContextType {
    user : User | null;
    loading : boolean,
    login : (email : string, password : string) => Promise<User>;
    logout : () => Promise<void>;
    setUser : (user : User | null) => void;

}

const AuthContext = createContext<AuthContextType | undefined>(
    undefined
)

interface AuthProviderProps{
    children : ReactNode
}

export function AuthProvider({
    children,
}: AuthProviderProps){
    
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect (() => {
        const loadUser = async () => {
            try{
                const currentUser = await getCurrentUser();
                setUser(currentUser);
            } catch {

            } finally {
                setLoading(false)
            }
        };
        loadUser();
    }, []);

    const login = async (
        email : string,
        password : string
    ) => {
        const response = await loginApi({
            email,
            password,
        });
        const currectUser : User = {
            userId : response.userId,
            fullName : response.fullName,
            role : response.role,
            email : response.email,
        };
        setUser(currectUser)
        return currectUser;
    };

    const logout = async () => {
        try{
            await api.post("/Auth/logout");
        } finally {
            setUser(null)
        }
    };
    
    return (
        <AuthContext.Provider
        value = {{
            user,
            loading,
            login,
            logout,
            setUser,
        }}
        >
            {children}
        </AuthContext.Provider>
    );
}
export function useAuth (){
    const context = useContext(AuthContext);

    if(!context){
        throw new Error(
            "useAuth must be inside AUthProvider"
        );
    }
    return context;
}