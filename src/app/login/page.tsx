import { Suspense } from "react";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#f3f5f9] text-sm text-slate-500">
          Loading login…
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
