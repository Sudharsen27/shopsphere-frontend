'use client';

import Link from "next/link";
import { useEffect } from "react";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Optionally log to an error reporting service
    // console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[60vh] items-center justify-center px-4">
      <section className="mx-auto max-w-xl text-center">
        <p className="text-sm font-semibold tracking-wide text-red-600">
          Something went wrong
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
          We&apos;re having trouble loading this page.
        </h1>
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          An unexpected error occurred while rendering this page. You can try
          again, or return to the homepage and continue shopping.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <button
            type="button"
            onClick={reset}
            className="inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 sm:w-auto"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center rounded-md border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800 sm:w-auto"
          >
            Go to homepage
          </Link>
        </div>
      </section>
    </main>
  );
}

