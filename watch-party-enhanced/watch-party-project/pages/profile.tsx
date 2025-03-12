import { useState } from "react";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { getSiteName } from "../lib/env";
import Image from "next/image";
import Link from "next/link";

export default function Profile() {
  const { data: session, status } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: session?.user?.name || "",
    bio: "I love watching videos with friends!",
    favoriteGenres: "Comedy, Action, Drama",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, you would save the profile data to a database here
    setIsEditing(false);
    // For now, we'll just update the local state
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-dark-800 text-white flex flex-col items-center justify-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-dark-800 text-white flex flex-col items-center justify-center">
        <div className="bg-dark-900 p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="mb-6">You need to be signed in to view this page.</p>
          <Link href="/auth/signin" className="bg-primary-600 py-2 px-4 rounded hover:bg-primary-700 transition">
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-800 text-white flex flex-col">
      <Head>
        <title>My Profile - {getSiteName()}</title>
      </Head>

      <div className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>

        <div className="bg-dark-900 rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex flex-col items-center">
                {session?.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    width={150}
                    height={150}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-36 h-36 bg-primary-700 rounded-full flex items-center justify-center text-4xl">
                    {session?.user?.name?.charAt(0) || "U"}
                  </div>
                )}
                <div className="mt-4 text-center">
                  <h2 className="text-xl font-semibold">{session?.user?.name}</h2>
                  <p className="text-gray-400">{session?.user?.email}</p>
                </div>
              </div>

              <div className="flex-1">
                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="displayName" className="block text-sm font-medium mb-1">
                        Display Name
                      </label>
                      <input
                        id="displayName"
                        name="displayName"
                        type="text"
                        value={profileData.displayName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="bio" className="block text-sm font-medium mb-1">
                        Bio
                      </label>
                      <textarea
                        id="bio"
                        name="bio"
                        rows={3}
                        value={profileData.bio}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="favoriteGenres" className="block text-sm font-medium mb-1">
                        Favorite Genres
                      </label>
                      <input
                        id="favoriteGenres"
                        name="favoriteGenres"
                        type="text"
                        value={profileData.favoriteGenres}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="bg-primary-600 py-2 px-4 rounded hover:bg-primary-700 transition"
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="bg-dark-700 py-2 px-4 rounded hover:bg-dark-600 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-300">Bio</h3>
                      <p>{profileData.bio}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-300">Favorite Genres</h3>
                      <p>{profileData.favoriteGenres}</p>
                    </div>

                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-primary-600 py-2 px-4 rounded hover:bg-primary-700 transition"
                    >
                      Edit Profile
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-dark-900 rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Watch History</h2>
            <div className="text-gray-400">
              <p>Your watch history will appear here.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
