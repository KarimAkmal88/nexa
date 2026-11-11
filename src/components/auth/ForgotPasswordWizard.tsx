"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowLeft, CheckCircle2, Eye, EyeOff } from "lucide-react";
import {
  forgotPasswordEmailSchema,
  verifyResetCodeSchema,
  resetPasswordSchema,
  type ForgotPasswordEmailFormData,
  type VerifyResetCodeFormData,
  type ResetPasswordFormData,
} from "@/lib/validations/auth";
import {
  requestPasswordReset,
  verifyResetCode,
  resetPassword,
} from "@/services/authService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type WizardStep = 1 | 2 | 3;

export function ForgotPasswordWizard() {
  const router = useRouter();

  const [step, setStep] = useState<WizardStep>(1);
  const [email, setEmail] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const attemptRef = useRef(0);

  const emailForm = useForm<ForgotPasswordEmailFormData>({
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: zodResolver(forgotPasswordEmailSchema),
    defaultValues: { email: "" },
  });

  const codeForm = useForm<VerifyResetCodeFormData>({
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: zodResolver(verifyResetCodeSchema),
    defaultValues: { resetCode: "" },
  });

  const resetForm = useForm<ResetPasswordFormData>({
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email: "", newPassword: "" },
  });

  const handleRequestCode = async (data: ForgotPasswordEmailFormData) => {
    attemptRef.current += 1;
    const currentAttempt = attemptRef.current;
    setServerError(null);
    const res = await requestPasswordReset(data.email);

    if (currentAttempt !== attemptRef.current) {
      return;
    }

    if (!res.success) {
      setServerError(res.error || "Failed to send reset code. Please try again.");
      return;
    }

    setEmail(data.email);
    resetForm.setValue("email", data.email);
    setStep(2);
  };

  const handleVerifyCode = async (data: VerifyResetCodeFormData) => {
    const currentAttempt = attemptRef.current;
    setServerError(null);
    const res = await verifyResetCode(data.resetCode);

    if (currentAttempt !== attemptRef.current) {
      return;
    }

    if (!res.success) {
      setServerError(res.error || "Reset code is invalid or has expired.");
      return;
    }

    if (!email) {
      handleRestart();
      return;
    }

    setStep(3);
  };

  const handleResetPassword = async (data: ResetPasswordFormData) => {
    if (!email) {
      handleRestart();
      return;
    }

    setServerError(null);
    setSuccessMessage(null);

    const res = await resetPassword({
      email: email,
      newPassword: data.newPassword,
    });

    if (!res.success) {
      setServerError(res.error || "Failed to reset password. Please try again.");
      return;
    }

    setSuccessMessage("Password reset successfully! Redirecting to sign in...");
    setTimeout(() => {
      router.push("/login");
    }, 1500);
  };

  const onEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    emailForm.handleSubmit(handleRequestCode)(e);
  };

  const onCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    codeForm.handleSubmit(handleVerifyCode)(e);
  };

  const onResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    resetForm.handleSubmit(handleResetPassword)(e);
  };

  const handleRestart = () => {
    attemptRef.current += 1;
    setStep(1);
    setEmail("");
    setServerError(null);
    setSuccessMessage(null);
    emailForm.reset();
    codeForm.reset();
    resetForm.reset();
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 sm:p-8 bg-card rounded-xl border border-border shadow-xs">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-primary">
          {step === 1 && "Reset your password"}
          {step === 2 && "Enter verification code"}
          {step === 3 && "Set new password"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {step === 1 && "Enter your email address and we'll send you a 6-digit reset code."}
          {step === 2 && `We sent a 6-digit code to ${email}.`}
          {step === 3 && "Create a new secure password for your account."}
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

      {step === 1 && (
        <form
          onSubmit={onEmailSubmit}
          className="space-y-4"
          noValidate
        >
          <div>
            <label
              htmlFor="step1-email"
              className="block text-sm font-medium text-foreground mb-1.5"
            >
              Email address
            </label>
            <Input
              id="step1-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              error={!!emailForm.formState.errors.email}
              aria-describedby={
                emailForm.formState.errors.email ? "step1-email-error" : undefined
              }
              {...emailForm.register("email")}
            />
            {emailForm.formState.errors.email && (
              <p id="step1-email-error" className="mt-1 text-xs text-red-600">
                {emailForm.formState.errors.email.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={emailForm.formState.isSubmitting}
            className="w-full h-10 mt-2 font-medium"
          >
            {emailForm.formState.isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin mr-2" />
                Sending code...
              </>
            ) : (
              "Send Reset Code"
            )}
          </Button>
        </form>
      )}

      {step === 2 && (
        <form
          onSubmit={onCodeSubmit}
          className="space-y-4"
          noValidate
        >
          <div>
            <label
              htmlFor="step2-code"
              className="block text-sm font-medium text-foreground mb-1.5"
            >
              6-Digit Reset Code
            </label>
            <Input
              id="step2-code"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="123456"
              className="text-center tracking-widest text-lg font-mono"
              error={!!codeForm.formState.errors.resetCode}
              aria-describedby={
                codeForm.formState.errors.resetCode ? "step2-code-error" : undefined
              }
              {...codeForm.register("resetCode")}
            />
            {codeForm.formState.errors.resetCode && (
              <p id="step2-code-error" className="mt-1 text-xs text-red-600">
                {codeForm.formState.errors.resetCode.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={codeForm.formState.isSubmitting}
            className="w-full h-10 mt-2 font-medium"
          >
            {codeForm.formState.isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin mr-2" />
                Verifying...
              </>
            ) : (
              "Verify Code"
            )}
          </Button>

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={handleRestart}
              disabled={codeForm.formState.isSubmitting}
              className="text-xs font-medium text-muted-foreground hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
            >
              Didn&apos;t receive code or wrong email? Start over
            </button>
          </div>
        </form>
      )}

      {step === 3 && (
        <form
          onSubmit={onResetSubmit}
          className="space-y-4"
          noValidate
        >
          <div>
            <label
              htmlFor="step3-newPassword"
              className="block text-sm font-medium text-foreground mb-1.5"
            >
              New Password
            </label>
            <div className="relative">
              <Input
                id="step3-newPassword"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="••••••••"
                className="pr-10"
                error={!!resetForm.formState.errors.newPassword}
                aria-describedby={
                  resetForm.formState.errors.newPassword
                    ? "step3-password-error"
                    : undefined
                }
                {...resetForm.register("newPassword")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground rounded-md focus:outline-hidden focus:ring-2 focus:ring-primary"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            <p id="step3-password-hint" className="mt-1 text-xs text-muted-foreground">
              Must be at least 8 characters with uppercase, lowercase, number, and special character.
            </p>
            {resetForm.formState.errors.newPassword && (
              <p id="step3-password-error" role="alert" className="mt-1 text-xs text-red-600">
                {resetForm.formState.errors.newPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={resetForm.formState.isSubmitting}
            className="w-full h-10 mt-2 font-medium"
          >
            {resetForm.formState.isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin mr-2" />
                Resetting password...
              </>
            ) : (
              "Set New Password"
            )}
          </Button>
        </form>
      )}

      <div className="mt-6 text-center">
        <Link
          href="/login"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="size-4 mr-1.5" />
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
