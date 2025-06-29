import { redirect } from 'next/navigation';

export default function SignOutPage() {
  // In a real app, you would clear the user's session here.
  redirect('/auth/sign-in');
}
