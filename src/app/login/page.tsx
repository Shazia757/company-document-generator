import { signIn } from "@/auth";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <form
        action={async (formData) => {
          "use server";

          await signIn("credentials", {
            email: formData.get("email"),
            password: formData.get("password"),
            redirectTo: "/",
          });
        }}
        className="w-full max-w-sm space-y-4"
      >
        <div>
          <h1 className="text-2xl font-semibold">Admin Login</h1>
          <p className="mt-1 text-sm text-gray-600">
            Sign in to access the document generator.
          </p>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="mt-1 w-full rounded border px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="mt-1 w-full rounded border px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded bg-black px-4 py-2 text-white"
        >
          Sign in
        </button>
      </form>
    </main>
  );
}
