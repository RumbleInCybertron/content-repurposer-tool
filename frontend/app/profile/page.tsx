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
  preferences?: {
    theme?: string;
    notifications?: {
      email?: boolean;
      push?: boolean;
    };
  };
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
      preferences: {
        theme: formData.get("theme"),
        notifications: {
          email: formData.get("notifications_email") === "on",
          push: formData.get("notifications_push") === "on",
        },
      },
    };

    console.log("Updated Profile Payload:", updatedProfile);

    try {
      const res = await fetch(`/api/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...updatedProfile, email: userProfile?.email }),
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
              <label className="block font-semibold">Theme</label>
              <select
                name="theme"
                defaultValue={userProfile.preferences?.theme || "light"}
                className="w-full p-2 border rounded"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold">Notifications</label>
              <label className="block">
                <input
                  type="checkbox"
                  name="notifications_email"
                  defaultChecked={userProfile.preferences?.notifications?.email}
                />
                Email Notifications
              </label>
              <label className="block">
                <input
                  type="checkbox"
                  name="notifications_push"
                  defaultChecked={userProfile.preferences?.notifications?.push}
                />
                Push Notifications
              </label>
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
              Update Profile
            </button>
            {updateStatus && <p className="mt-4">{updateStatus}</p>}
          </form>
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