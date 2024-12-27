'use client';

import { signIn, signOut, useSession } from 'next-auth/react';

export default function AuthTestPage() {
  const { data: session } = useSession();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Google OAuth Test</h1>

      {session ? (
        <div>
          <p className="mb-4">Welcome, {session.user?.email || 'User'}!</p>
          <button
            onClick={() => signOut()}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <div>
          <button
            onClick={() => signIn('google')}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 w-full text-center"
          >
            Sign In with Google
          </button>
        </div>
      )}
    </div>
  );
}
