'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { API_ROUTES } from '@/services/API_ROUTES';
import type { KullaniciDto, LoginRequest, LoginResponseDto } from '@/types';

interface AuthContextType {
    user: KullaniciDto | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (credentials: LoginRequest) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<KullaniciDto | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
        }
        setIsLoading(false);
    }, []);

    const login = async (credentials: LoginRequest) => {
        const response = await api.post<LoginResponseDto>(API_ROUTES.LOGIN, credentials);
        const { token: newToken, kullanici } = response.data;
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(kullanici));
        setToken(newToken);
        setUser(kullanici);
        router.push('/');
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        router.push('/auth/login');
    };

    return (
        <AuthContext.Provider value={{
            user, token, isLoading,
            isAuthenticated: !!token,
            login, logout,
        }}>
            {children}
        </AuthContext.Provider>
    );
}
