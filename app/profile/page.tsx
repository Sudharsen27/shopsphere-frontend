"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { authApi, ApiError } from "@/lib/api";
import ProtectedRoute from "../components/ProtectedRoute";

export default function ProfilePage() {
  const router = useRouter();
  const { userInfo, login } = useAuth();

  type Address = { _id: string; address: string; city: string; postalCode: string; country: string; isDefault?: boolean };
  const [activeTab, setActiveTab] = useState<"profile" | "password" | "addresses">("profile");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Addresses
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressLoading, setAddressLoading] = useState(false);
  const [addressForm, setAddressForm] = useState({ address: "", city: "", postalCode: "", country: "", isDefault: false });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Address | null>(null);

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
      setAddresses((userInfo as any).addresses || []);
    }
  }, [userInfo]);

  // Load addresses when switching to Addresses tab
  useEffect(() => {
    if (activeTab === "addresses" && userInfo) {
      setAddressLoading(true);
      authApi.getProfile().then((res: any) => {
        const list = res?.user?.addresses || [];
        setAddresses(Array.isArray(list) ? list : []);
      }).catch(() => setAddresses([])).finally(() => setAddressLoading(false));
    }
  }, [activeTab, userInfo]);

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

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressForm.address.trim() || !addressForm.city.trim() || !addressForm.postalCode.trim() || !addressForm.country.trim()) {
      setError("Please fill all address fields");
      return;
    }
    setError(null); setSuccess(null); setLoading(true);
    try {
      const res = await authApi.addAddress(
        addressForm.address.trim(),
        addressForm.city.trim(),
        addressForm.postalCode.trim(),
        addressForm.country.trim(),
        addressForm.isDefault
      );
      setAddresses((res as any).addresses || []);
      setAddressForm({ address: "", city: "", postalCode: "", country: "", isDefault: false });
      setSuccess("Address added.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to add address");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId || !editForm) return;
    if (!editForm.address.trim() || !editForm.city.trim() || !editForm.postalCode.trim() || !editForm.country.trim()) {
      setError("Please fill all address fields");
      return;
    }
    setError(null); setSuccess(null); setLoading(true);
    try {
      const res = await authApi.updateAddress(editingId, {
        address: editForm.address.trim(),
        city: editForm.city.trim(),
        postalCode: editForm.postalCode.trim(),
        country: editForm.country.trim(),
        isDefault: editForm.isDefault,
      });
      setAddresses((res as any).addresses || []);
      setEditingId(null); setEditForm(null);
      setSuccess("Address updated.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to update address");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm("Remove this address?")) return;
    setError(null); setSuccess(null); setLoading(true);
    try {
      const res = await authApi.deleteAddress(id);
      setAddresses((res as any).addresses || []);
      if (editingId === id) { setEditingId(null); setEditForm(null); }
      setSuccess("Address removed.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to delete address");
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefaultAddress = async (id: string) => {
    setError(null); setSuccess(null); setLoading(true);
    try {
      const res = await authApi.setDefaultAddress(id);
      setAddresses((res as any).addresses || []);
      setSuccess("Default address updated.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to set default");
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
            <button
              onClick={() => {
                setActiveTab("addresses");
                setError(null);
                setSuccess(null);
              }}
              className={`px-6 py-3 font-medium transition ${
                activeTab === "addresses"
                  ? "border-b-2 border-green-500 text-green-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Saved Addresses
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

          {/* Addresses Tab */}
          {activeTab === "addresses" && (
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 space-y-6">
              <h2 className="text-2xl font-bold">Saved Addresses</h2>
              <p className="text-gray-400 text-sm">Use these at checkout for faster ordering. You can set one as default.</p>

              {addressLoading ? (
                <p className="text-gray-400">Loading addresses...</p>
              ) : (
                <>
                  <div className="space-y-4">
                    {addresses.map((addr) => (
                      <div
                        key={addr._id}
                        className={`border rounded-lg p-4 ${addr.isDefault ? "border-green-500 bg-green-500/5" : "border-gray-700"}`}
                      >
                        {editingId === addr._id && editForm ? (
                          <form onSubmit={handleUpdateAddress} className="space-y-3">
                            <input
                              value={editForm.address}
                              onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                              placeholder="Address"
                              className="w-full px-3 py-2 bg-black border border-gray-600 rounded text-white text-sm"
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <input value={editForm.city} onChange={(e) => setEditForm({ ...editForm, city: e.target.value })} placeholder="City" className="w-full px-3 py-2 bg-black border border-gray-600 rounded text-white text-sm" />
                              <input value={editForm.postalCode} onChange={(e) => setEditForm({ ...editForm, postalCode: e.target.value })} placeholder="Postal Code" className="w-full px-3 py-2 bg-black border border-gray-600 rounded text-white text-sm" />
                            </div>
                            <input value={editForm.country} onChange={(e) => setEditForm({ ...editForm, country: e.target.value })} placeholder="Country" className="w-full px-3 py-2 bg-black border border-gray-600 rounded text-white text-sm" />
                            <label className="flex items-center gap-2 text-sm">
                              <input type="checkbox" checked={!!editForm.isDefault} onChange={(e) => setEditForm({ ...editForm, isDefault: e.target.checked })} className="rounded text-green-600" />
                              Default address
                            </label>
                            <div className="flex gap-2">
                              <button type="submit" disabled={loading} className="px-4 py-2 bg-green-600 rounded text-sm font-medium disabled:opacity-70">Save</button>
                              <button type="button" onClick={() => { setEditingId(null); setEditForm(null); }} className="px-4 py-2 bg-gray-700 rounded text-sm">Cancel</button>
                            </div>
                          </form>
                        ) : (
                          <>
                            <p className="text-white font-medium">{addr.address}, {addr.city} {addr.postalCode}, {addr.country}</p>
                            {addr.isDefault && <span className="inline-block mt-1 text-xs text-green-400 font-medium">Default</span>}
                            <div className="mt-2 flex flex-wrap gap-2">
                              <button type="button" onClick={() => { setEditingId(addr._id); setEditForm({ ...addr }); }} className="text-sm text-green-400 hover:underline">Edit</button>
                              {!addr.isDefault && <button type="button" onClick={() => handleSetDefaultAddress(addr._id)} className="text-sm text-gray-400 hover:underline">Set as default</button>}
                              <button type="button" onClick={() => handleDeleteAddress(addr._id)} className="text-sm text-red-400 hover:underline">Remove</button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleAddAddress} className="border border-dashed border-gray-600 rounded-lg p-4 space-y-3">
                    <h3 className="font-semibold text-gray-300">Add new address</h3>
                    <input value={addressForm.address} onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })} placeholder="Address" className="w-full px-3 py-2 bg-black border border-gray-600 rounded text-white" required />
                    <div className="grid grid-cols-2 gap-2">
                      <input value={addressForm.city} onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} placeholder="City" className="w-full px-3 py-2 bg-black border border-gray-600 rounded text-white" required />
                      <input value={addressForm.postalCode} onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })} placeholder="Postal Code" className="w-full px-3 py-2 bg-black border border-gray-600 rounded text-white" required />
                    </div>
                    <input value={addressForm.country} onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })} placeholder="Country" className="w-full px-3 py-2 bg-black border border-gray-600 rounded text-white" required />
                    <label className="flex items-center gap-2 text-sm text-gray-400">
                      <input type="checkbox" checked={addressForm.isDefault} onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })} className="rounded text-green-600" />
                      Set as default
                    </label>
                    <button type="submit" disabled={loading} className="w-full py-2 bg-green-600 hover:bg-green-700 rounded font-medium disabled:opacity-70">Add Address</button>
                  </form>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
