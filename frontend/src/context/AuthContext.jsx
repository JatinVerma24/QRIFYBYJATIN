import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const API_URL = 'http://localhost:5000/api/auth';

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('qrify_token'));
    const [loading, setLoading] = useState(true);

    // Set default axios auth header
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [token]);

    // Check auth on mount
    useEffect(() => {
        const checkAuth = async () => {
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const res = await axios.get(`${API_URL}/me`);
                setUser(res.data.user);
            } catch {
                localStorage.removeItem('qrify_token');
                setToken(null);
                setUser(null);
            }
            setLoading(false);
        };
        checkAuth();
    }, [token]);

    const login = async (email, password) => {
        const res = await axios.post(`${API_URL}/login`, { email, password });
        localStorage.setItem('qrify_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        return res.data;
    };

    const signup = async (name, email, password) => {
        const res = await axios.post(`${API_URL}/signup`, { name, email, password });
        localStorage.setItem('qrify_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        return res.data;
    };

    const logout = () => {
        localStorage.removeItem('qrify_token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
