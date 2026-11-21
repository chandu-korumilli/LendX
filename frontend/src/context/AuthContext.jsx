
import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import {
    getCurrentUser,
    logoutUser
} from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check existing login when application starts
    useEffect(() => {
        async function loadUser() {
            const token = localStorage.getItem("token");

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await getCurrentUser();

                const currentUser =
                    response.data?.user ||
                    response.user ||
                    response.data ||
                    response;

                setUser(currentUser);

            } catch (error) {
                console.error("Authentication error:", error);
                logoutUser();
                setUser(null);

            } finally {
                setLoading(false);
            }
        }

        loadUser();
    }, []);

    // Login user
    function login(userData, token) {
        if (token) {
            localStorage.setItem("token", token);
        }

        setUser(userData);
    }

    // Logout user
    function logout() {
        logoutUser();
        setUser(null);
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                isAuthenticated: !!user
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// Custom authentication hook
export function useAuth() {
    return useContext(AuthContext);
}
