
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-6">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="mb-8">
            <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg bg-gray-900 text-sm font-semibold text-white">
              CD
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
              Admin Login
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Sign in to access the company document generator.
            </p>
          </div>

          <LoginForm />
        </div>

        <p className="mt-5 text-center text-xs text-gray-400">
          Authorized company users only
        </p>
      </div>
    </main>
  );
}

