"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, CheckCircle2, Lock } from "lucide-react";
import {
  changePasswordSchema,
  type ChangePasswordFormData,
} from "@/lib/validations/auth";
import { changeUserPassword } from "@/services/authService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ChangePasswordForm() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormData>({
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      password: "",
      rePassword: "",
    },
  });

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (status === "unauthenticated" || !session?.token) {
    router.push("/login?callbackUrl=/change-password");
    return null;
  }

  const onSubmit = async (data: ChangePasswordFormData) => {
    setServerError(null);
    setSuccessMessage(null);

    const token = session.token;
    if (!token) {
      setServerError("Authentication session missing. Please sign in again.");
      return;
    }

    const res = await changeUserPassword(data, token);

    if (!res.success) {
      setServerError(res.error || "Failed to update password. Please check your current password.");
      return;
    }

    setSuccessMessage("Password changed successfully! Signing out to refresh your session...");
    setTimeout(async () => {
      await signOut({ callbackUrl: "/login" });
    }, 1500);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 sm:p-8 bg-card rounded-xl border border-border shadow-xs">
      <div className="mb-6 text-center">
        <div className="mx-auto size-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
          <Lock className="size-6 text-primary" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-primary">Change Password</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Update your account password for enhanced security
        </p>
      </div>

      {serverError && (
        <div
          role="alert"
          className="mb-6 p-3 text-sm rounded-lg bg-red-50 border border-red-200 text-red-700"
        >
          {serverError}
        </div>
      )}

      {successMessage && (
        <div
          role="status"
          className="mb-6 p-3 text-sm rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center gap-2"
        >
          <CheckCircle2 className="size-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label
            htmlFor="currentPassword"
            className="block text-sm font-medium text-foreground mb-1.5"
          >
            Current Password
          </label>
          <div className="relative">
            <Input
              id="currentPassword"
              type={showCurrent ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              className="pr-10"
              error={!!errors.currentPassword}
              aria-describedby={
                errors.currentPassword ? "currentPassword-error" : undefined
              }
              {...register("currentPassword")}
            />
            <button
              type="button"
              onClick={() => setShowCurrent((prev) => !prev)}
              aria-label={showCurrent ? "Hide current password" : "Show current password"}
              aria-pressed={showCurrent}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground rounded-md focus:outline-hidden focus:ring-2 focus:ring-primary"
            >
              {showCurrent ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {errors.currentPassword && (
            <p id="currentPassword-error" className="mt-1 text-xs text-red-600">
              {errors.currentPassword.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-foreground mb-1.5"
          >
            New Password
          </label>
          <div className="relative">
            <Input
              id="password"
              type={showNew ? "text" : "password"}
              autoComplete="new-password"
              placeholder="••••••••"
              className="pr-10"
              error={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowNew((prev) => !prev)}
              aria-label={showNew ? "Hide new password" : "Show new password"}
              aria-pressed={showNew}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground rounded-md focus:outline-hidden focus:ring-2 focus:ring-primary"
            >
              {showNew ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          <p id="new-password-hint" className="mt-1 text-xs text-muted-foreground">
            Must be at least 8 characters with uppercase, lowercase, number, and special character.
          </p>
          {errors.password && (
            <p id="password-error" role="alert" className="mt-1 text-xs text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="rePassword"
            className="block text-sm font-medium text-foreground mb-1.5"
          >
            Confirm New Password
          </label>
          <div className="relative">
            <Input
              id="rePassword"
              type={showConfirm ? "text" : "password"}
              autoComplete="new-password"
              placeholder="••••••••"
              className="pr-10"
              error={!!errors.rePassword}
              aria-describedby={errors.rePassword ? "rePassword-error" : undefined}
              {...register("rePassword")}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((prev) => !prev)}
              aria-label={showConfirm ? "Hide confirm new password" : "Show confirm new password"}
              aria-pressed={showConfirm}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground rounded-md focus:outline-hidden focus:ring-2 focus:ring-primary"
            >
              {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {errors.rePassword && (
            <p id="rePassword-error" className="mt-1 text-xs text-red-600">
              {errors.rePassword.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-10 mt-2 font-medium"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin mr-2" />
              Updating password...
            </>
          ) : (
            "Update Password"
          )}
        </Button>
      </form>
    </div>
  );
}
