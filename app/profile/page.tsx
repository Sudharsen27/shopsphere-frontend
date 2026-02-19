"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { authApi, ApiError } from "@/lib/api";
import ProtectedRoute from "../components/ProtectedRoute";

export default function ProfilePage() {
  const router = useRouter();
  const { userInfo, login } = useAuth();

  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Profile form state
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Load user data
  useEffect(() => {
    if (userInfo) {
      setProfileData({
        name: userInfo.name || "",
        email: userInfo.email || "",
      });
    }
  }, [userInfo]);

  // Handle profile update
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await authApi.updateProfile(
        profileData.name.trim(),
        profileData.email.trim()
      );

      // Update auth context
      if (userInfo) {
        login({
          ...userInfo,
          name: response.user.name,
          email: response.user.email,
        });
      }

      setSuccess("Profile updated successfully!");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to update profile. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (passwordData.newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await authApi.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );

      setSuccess("Password changed successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to change password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black text-white p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">My Profile</h1>

          {/* Tabs */}
          <div className="flex gap-4 mb-6 border-b border-gray-700">
            <button
              onClick={() => {
                setActiveTab("profile");
                setError(null);
                setSuccess(null);
              }}
              className={`px-6 py-3 font-medium transition ${
                activeTab === "profile"
                  ? "border-b-2 border-green-500 text-green-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Profile Information
            </button>
            <button
              onClick={() => {
                setActiveTab("password");
                setError(null);
                setSuccess(null);
              }}
              className={`px-6 py-3 font-medium transition ${
                activeTab === "password"
                  ? "border-b-2 border-green-500 text-green-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Change Password
            </button>
          </div>

          {/* Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded text-red-400">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded text-green-400">
              {success}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-6">Profile Information</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) =>
                        setProfileData({ ...profileData, name: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          email: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Role
                    </label>
                    <input
                      type="text"
                      value={userInfo?.role || "user"}
                      disabled
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 cursor-not-allowed"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-6 w-full bg-green-600 hover:bg-green-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition"
                >
                  {loading ? "Updating..." : "Update Profile"}
                </button>
              </div>
            </form>
          )}

          {/* Password Tab */}
          {activeTab === "password" && (
            <form onSubmit={handlePasswordChange} className="space-y-6">
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-6">Change Password</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            currentPassword: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 pr-12"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPasswords({
                            ...showPasswords,
                            current: !showPasswords.current,
                          })
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showPasswords.current ? "👁️" : "👁️‍🗨️"}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            newPassword: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 pr-12"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPasswords({
                            ...showPasswords,
                            new: !showPasswords.new,
                          })
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showPasswords.new ? "👁️" : "👁️‍🗨️"}
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-gray-400">
                      Must be at least 6 characters
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 pr-12"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPasswords({
                            ...showPasswords,
                            confirm: !showPasswords.confirm,
                          })
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showPasswords.confirm ? "👁️" : "👁️‍🗨️"}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-6 w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition"
                >
                  {loading ? "Changing Password..." : "Change Password"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
