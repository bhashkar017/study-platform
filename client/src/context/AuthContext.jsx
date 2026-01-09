import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkLoggedIn = async () => {
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (token && storedUser) {
                setUser(JSON.parse(storedUser));
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            }
            setLoading(false);
        };
        checkLoggedIn();
    }, []);

    const login = (token, userData) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
    };

    const refreshUser = async () => {
        try {
            console.log("Refreshing user data...");
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/me`);
            console.log("User data refreshed:", res.data);
            setUser(res.data);
            localStorage.setItem('user', JSON.stringify(res.data));
        } catch (err) {
            console.error("Failed to refresh user data", err);
        }
    };

    const [chatState, setChatState] = useState({ isOpen: false, activeUser: null });

    const openChat = (user) => {
        setChatState({ isOpen: true, activeUser: user });
    };

    const closeChat = () => {
        setChatState({ isOpen: false, activeUser: null });
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, refreshUser, chatState, openChat, closeChat }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
