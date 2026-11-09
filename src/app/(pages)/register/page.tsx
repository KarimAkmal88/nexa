import { Suspense } from "react";
import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Create Account | Nexa",
  description: "Create a new Nexa account",
};

export default function RegisterPage() {
  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Suspense
        fallback={
          <div className="flex justify-center items-center p-12">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
        }
      >
        <RegisterForm />
      </Suspense>
    </div>
  );
}
