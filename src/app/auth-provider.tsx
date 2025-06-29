'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return;

    const isAuthPage = pathname.startsWith('/auth');
    
    if (!user && !isAuthPage) {
      router.push('/auth/sign-in');
    } else if (user && isAuthPage && pathname !== '/auth/sign-out') {
        router.push('/dashboard');
    }
  }, [user, loading, router, pathname]);
  
  const protectedContent = () => {
    if(loading) {
       return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
       )
    }
    
    const isAuthPage = pathname.startsWith('/auth');
    if (!user && !isAuthPage) {
        return null;
    }

    if(user && isAuthPage && pathname !== '/auth/sign-out') {
        return null;
    }

    return children;
  }

  return (
    <AuthContext.Provider value={{ user, loading }}>
        {protectedContent()}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
