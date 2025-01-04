// frontend/app/login/page.tsx

"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <button
          onClick={() => signIn("google", {callbackUrl: "/profile"})}
          className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-700 mb-2"
        >
          Login with Google
        </button>
        <button
          onClick={() => signIn("twitter", {callbackUrl: "/profile"})}
          className="bg-blue-400 text-white px-4 py-2 rounded w-full hover:bg-blue-600"
        >
          Login with Twitter
        </button>
      </div>
    </div>
  );
}
