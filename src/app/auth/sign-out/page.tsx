'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';

export default function SignOutPage() {
  const router = useRouter();

  useEffect(() => {
    const performSignOut = async () => {
      try {
        await signOut(auth);
      } catch (error) {
        console.error("Error signing out: ", error);
      } finally {
        // Allow time for state to propagate before pushing to sign-in
        setTimeout(() => router.push('/auth/sign-in'), 50);
      }
    };
    performSignOut();
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center gap-2">
      <Loader2 className="h-6 w-6 animate-spin" />
      <p className="text-lg">Signing out...</p>
    </div>
  );
}
