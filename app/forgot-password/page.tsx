"use client";

import { useState } from "react";
import Link from "next/link";
import { authApi, ApiError } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [resetUrl, setResetUrl] = useState<string | null>(null);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }
    if (!validateEmail(email.trim())) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.forgotPassword(email.trim());
      setSuccess(true);
      if (res.resetUrl) setResetUrl(res.resetUrl);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-[80vh] flex items-center px-4 sm:px-6 py-8 sm:py-12">
      <div className="max-w-md w-full mx-auto border border-gray-700 rounded-lg p-6 sm:p-8 bg-gray-900/50 backdrop-blur-sm">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-center text-white">
          Forgot password
        </h1>
        <p className="text-gray-400 text-center mb-6">
          Enter your email and we&apos;ll send you a link to reset your password.
        </p>

        {success ? (
          <div className="space-y-4">
            <div className="p-4 bg-green-900/30 border border-green-700 rounded-lg text-green-300 text-sm">
              If an account exists for this email, you will receive a password reset link.
            </div>
            {resetUrl && (
              <p className="text-sm text-gray-400 break-all">
                <span className="text-white">Reset link (dev):</span>{" "}
                <a href={resetUrl} className="text-blue-400 hover:underline">
                  {resetUrl}
                </a>
              </p>
            )}
            <p className="text-sm text-center text-gray-400">
              <Link href="/login" className="text-blue-500 hover:text-blue-400 font-medium">
                Back to login
              </Link>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={loading}
                autoComplete="email"
              />
            </div>
            {error && (
              <p className="text-sm text-red-400">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition flex items-center justify-center"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Sending...
                </span>
              ) : (
                "Send reset link"
              )}
            </button>
          </form>
        )}

        <p className="mt-6 text-sm text-center text-gray-400">
          <Link href="/login" className="text-blue-500 hover:text-blue-400 font-medium">
            Back to login
          </Link>
        </p>
      </div>
    </section>
  );
}
