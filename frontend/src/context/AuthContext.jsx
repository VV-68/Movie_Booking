import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem("token") || null);
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem("user");
        if (!stored) return null;
        try {
            return JSON.parse(stored);
        } catch {
            return null;
        }
    });

    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
        } else {
            localStorage.removeItem("token");
        }
    }, [token]);

    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem("user");
        }
    }, [user]);

    const login = (newToken, userData) => {
        setToken(newToken);
        setUser(userData || null);
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("adminUser");
        localStorage.removeItem("userInfo");
        localStorage.removeItem("token");
        sessionStorage.clear();
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
