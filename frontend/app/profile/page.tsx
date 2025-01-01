// frontend/app/profile/page.tsx

"use client";

import { signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  preferences?: Record<string, unknown>;
}


export default async function ProfilePage() {
  const { data: session, status } = useSession();

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updateStatus, setUpdateStatus] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserProfile() {
      if (!session?.user?.email) {
        console.error("Email is missing in the session object.");
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`/api/profile?email=${session.user.email}`);
        if (!res.ok) throw new Error("Failed to fetch user profile");
        const data = await res.json();
        setUserProfile(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    if (status === "authenticated") {
      fetchUserProfile();
    }
  }, [session, status]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const updatedProfile = {
      name: formData.get("name"),
      email: session?.user?.email,
      preferences: formData.get("preferences"),
    };

    try {
      const res = await fetch(`/api/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProfile),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      setUpdateStatus("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      setUpdateStatus("Failed to update profile.");
    }
  };


  if (status === "loading" || loading) {
    return <p>Loading...</p>;
  }

  if (!session) {
    return <div>Please log in to view your profile.</div>;
  }


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      {session ? (
        <div className="bg-gray-100 p-6 shadow-md rounded-lg">
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block font-semibold">Name</label>
              <input
                type="text"
                name="name"
                defaultValue={userProfile?.name || ""}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block font-semibold">Preferences</label>
              <textarea
                name="preferences"
                defaultValue={userProfile?.preferences? JSON.stringify(userProfile.preferences) : ""}
                className="w-full p-2 border rounded"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Update Profile
            </button>
          </form>
          {updateStatus && <p className="mt-4">{updateStatus}</p>}
          <button
            onClick={() => signOut()}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      ) : (
        <p>Profile not found.</p>
      )}
    </div>
  );
}
