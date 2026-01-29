"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { authApi, ApiError } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const { login, userInfo, loading: authLoading } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && userInfo) {
      router.replace("/");
    }
  }, [userInfo, authLoading, router]);

  // Validate email format
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate password strength
  const validatePasswordStrength = (password: string): string | null => {
    if (password.length < 6) {
      return "Password must be at least 6 characters long";
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/(?=.*\d)/.test(password)) {
      return "Password must contain at least one number";
    }
    return null;
  };

  // Handle form submission
  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    // Client-side validation
    const errors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!name.trim()) {
      errors.name = "Name is required";
    } else if (name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    } else if (name.trim().length > 50) {
      errors.name = "Name cannot exceed 50 characters";
    } else if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
      errors.name = "Name can only contain letters and spaces";
    }

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!validateEmail(email)) {
      errors.email = "Please enter a valid email address";
    }

    const passwordError = validatePasswordStrength(password);
    if (passwordError) {
      errors.password = passwordError;
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);

    try {
      const response = await authApi.register(
        name.trim(),
        email.trim(),
        password
      );

      // Clear old session
      localStorage.removeItem("userInfo");
      localStorage.removeItem("cart");

      // Login user automatically after registration
      login({
        _id: response.user.id,
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        role: response.user.role,
        token: response.token,
      });

      // Redirect to home
      router.replace("/");
    } catch (err) {
      if (err instanceof ApiError) {
        // Handle validation errors from backend
        if (err.errors && err.errors.length > 0) {
          const backendErrors: {
            name?: string;
            email?: string;
            password?: string;
          } = {};
          err.errors.forEach((error) => {
            if (error.field === "name") {
              backendErrors.name = error.message;
            } else if (error.field === "email") {
              backendErrors.email = error.message;
            } else if (error.field === "password") {
              backendErrors.password = error.message;
            }
          });
          setFieldErrors(backendErrors);
        }
        setError(err.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Don't render if already authenticated
  if (authLoading || userInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          <p className="mt-4 text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-[80vh] flex items-center px-6 py-12">
      <div className="max-w-md w-full mx-auto border border-gray-700 rounded-lg p-8 bg-gray-900/50 backdrop-blur-sm">
        <h1 className="text-3xl font-bold mb-2 text-center text-white">
          Register
        </h1>
        <p className="text-center text-gray-400 mb-6">
          Create your ShopSphere account to get started.
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={submitHandler} className="space-y-5">
          {/* Name Field */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Full Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="John Doe"
              className={`w-full p-3 border rounded-lg bg-black text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition ${
                fieldErrors.name
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-600 focus:ring-green-500"
              }`}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (fieldErrors.name) {
                  setFieldErrors({ ...fieldErrors, name: undefined });
                }
              }}
              disabled={loading}
              autoComplete="name"
            />
            {fieldErrors.name && (
              <p className="mt-1 text-sm text-red-400">{fieldErrors.name}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              className={`w-full p-3 border rounded-lg bg-black text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition ${
                fieldErrors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-600 focus:ring-green-500"
              }`}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) {
                  setFieldErrors({ ...fieldErrors, email: undefined });
                }
              }}
              disabled={loading}
              autoComplete="email"
            />
            {fieldErrors.email && (
              <p className="mt-1 text-sm text-red-400">{fieldErrors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                className={`w-full p-3 border rounded-lg bg-black text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition pr-12 ${
                  fieldErrors.password
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-600 focus:ring-green-500"
                }`}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) {
                    setFieldErrors({ ...fieldErrors, password: undefined });
                  }
                }}
                disabled={loading}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="mt-1 text-sm text-red-400">
                {fieldErrors.password}
              </p>
            )}
            {password && !fieldErrors.password && (
              <p className="mt-1 text-xs text-gray-400">
                Password must contain uppercase, lowercase, and a number
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-enter your password"
                className={`w-full p-3 border rounded-lg bg-black text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition pr-12 ${
                  fieldErrors.confirmPassword
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-600 focus:ring-green-500"
                }`}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (fieldErrors.confirmPassword) {
                    setFieldErrors({
                      ...fieldErrors,
                      confirmPassword: undefined,
                    });
                  }
                }}
                disabled={loading}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                tabIndex={-1}
              >
                {showConfirmPassword ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
            {fieldErrors.confirmPassword && (
              <p className="mt-1 text-sm text-red-400">
                {fieldErrors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition duration-200 flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating account...
              </>
            ) : (
              "Register"
            )}
          </button>
        </form>

        {/* Login Link */}
        <p className="mt-6 text-sm text-center text-gray-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-500 hover:text-blue-400 font-medium transition"
          >
            Login
          </Link>
        </p>
      </div>
    </section>
  );
}
