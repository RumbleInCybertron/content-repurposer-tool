// frontend/app/profile/page.tsx

"use client";

import { signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import { useRouter } from 'next/navigation';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  preferences?: Record<string, unknown>;
}


const ProfilePage = () => {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updateStatus, setUpdateStatus] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const session = await getSession();
      if (!session?.user?.email) {
        router.replace('/');
        return;
      }

      const email = encodeURIComponent(session.user.email);
      const apiUrl = `/api/profile?email=${email}`;
      console.log("Fetching profile from:", apiUrl);
      
      try {
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error("Failed to fetch user profile");
        const data = await res.json();
        setUserProfile(data);
      } catch (error) {
        console.error("Profile Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    if (!userProfile?.email) {
      console.error("Session email is missing. Cannot update profile.");
      setUpdateStatus("Failed to update profile: Session email is missing.");
      return;
    }

    const updatedProfile = {
      name: formData.get("name"),
      email: userProfile?.email,
      preferences: (() => {
        try {
          return JSON.parse(formData.get("preferences") as string || "{}");
        } catch {
          console.error("Invalid preferences format. Must be valid JSON.");
          return {};
        }
      })(),
    };

    console.log("Updated Profile Payload:", updatedProfile);

    try {
      const res = await fetch(`/api/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProfile),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`Failed to update profile: ${errorData.error || "Unknown error"}`);
      }

      setUpdateStatus("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      setUpdateStatus("Failed to update profile.");
    }
  };


  // if (status === "loading" || loading) {
  //   return <p>Loading...</p>;
  // }

  // if (!session?.user) {
  //   return <div>Please log in to view your profile.</div>;
  // }


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      {userProfile ? (
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
            onClick={() => signOut({ callbackUrl: '/'})}
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

export default ProfilePage;