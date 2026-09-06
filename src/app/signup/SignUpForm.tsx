"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { signUp } from "@/app/actions/auth";

export default function SignUpForm() {
    const router = useRouter();

    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    async function handleSubmit(formData: FormData) {
        setError("");
        setIsLoading(true);

        const name = String(formData.get("name") ?? "");
        const email = String(formData.get("email") ?? "");
        const password = String(formData.get("password") ?? "");

        const result = await signUp(name, email, password);

        if (!result.success) {
            setError(result.error);
            setIsLoading(false);
            return;
        }

        router.push("/login?registered=true");
    }

    return (
        <form action={handleSubmit} className="space-y-5">
            <div>
                <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                >
                    Full name
                </label>

                <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Enter your name"
                    className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                />
            </div>

            <div>
                <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                >
                    Email address
                </label>

                <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                />
            </div>

            <div>
                <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                >
                    Password
                </label>

                <div className="relative mt-2">
                    <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        autoComplete="new-password"
                        placeholder="At least 8 characters"
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 pr-16 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                    />

                    <button
                        type="button"
                        onClick={() =>
                            setShowPassword((previous) => !previous)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-500 hover:text-gray-900"
                    >
                        {showPassword ? "Hide" : "Show"}
                    </button>
                </div>
            </div>

            {error && (
                <p
                    role="alert"
                    className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
                >
                    {error}
                </p>
            )}

            <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
            >
                {isLoading ? "Creating account..." : "Create account"}
            </button>
        </form>
    );
}