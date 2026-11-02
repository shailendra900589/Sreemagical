import { Suspense } from "react";
import { SignupForm } from "./SignupForm";

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#f3f5f9] text-sm text-slate-500">
          Loading signup…
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  );
}
