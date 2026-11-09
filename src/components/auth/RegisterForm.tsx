"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import { registerSchema, type RegisterFormData } from "@/lib/validations/auth";
import { registerUser } from "@/services/auth.service";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function RegisterForm() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      rePassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setServerError(null);
    setSuccessMessage(null);

    const res = await registerUser(data);

    if (!res.success) {
      setServerError(res.error || "Registration failed. Please try again.");
      return;
    }

    setSuccessMessage("Account created successfully! Redirecting to sign in...");
    setTimeout(() => {
      router.push("/login");
    }, 1500);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 sm:p-8 bg-card rounded-xl border border-neutral-200 shadow-xs">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Create an account</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Join Nexa to shop modern essentials
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
            htmlFor="name"
            className="block text-sm font-medium text-neutral-700 mb-1.5"
          >
            Full Name
          </label>
          <Input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="John Doe"
            error={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            {...register("name")}
          />
          {errors.name && (
            <p id="name-error" role="alert" className="mt-1 text-xs text-red-600">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-neutral-700 mb-1.5"
          >
            Email address
          </label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            error={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            {...register("email")}
          />
          {errors.email && (
            <p id="email-error" role="alert" className="mt-1 text-xs text-red-600">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-neutral-700 mb-1.5"
          >
            Phone Number
          </label>
          <Input
            id="phone"
            type="tel"
            autoComplete="tel"
            placeholder="01012345678"
            error={!!errors.phone}
            aria-describedby={errors.phone ? "phone-error" : "phone-hint"}
            {...register("phone")}
          />
          <p id="phone-hint" className="mt-1 text-xs text-neutral-500">
            e.g. 01012345678 (Egyptian mobile format)
          </p>
          {errors.phone && (
            <p id="phone-error" role="alert" className="mt-1 text-xs text-red-600">
              {errors.phone.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-neutral-700 mb-1.5"
          >
            Password
          </label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="••••••••"
              className="pr-10"
              error={!!errors.password}
              aria-describedby={errors.password ? "password-error" : "password-hint"}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-neutral-500 hover:text-neutral-800 rounded-md focus:outline-hidden focus:ring-2 focus:ring-primary"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          <p id="password-hint" className="mt-1 text-xs text-neutral-500">
            At least 8 characters with uppercase, lowercase, number, and special character.
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
            className="block text-sm font-medium text-neutral-700 mb-1.5"
          >
            Confirm Password
          </label>
          <div className="relative">
            <Input
              id="rePassword"
              type={showRePassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="••••••••"
              className="pr-10"
              error={!!errors.rePassword}
              aria-describedby={errors.rePassword ? "rePassword-error" : undefined}
              {...register("rePassword")}
            />
            <button
              type="button"
              onClick={() => setShowRePassword((prev) => !prev)}
              aria-label={showRePassword ? "Hide confirm password" : "Show confirm password"}
              aria-pressed={showRePassword}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-neutral-500 hover:text-neutral-800 rounded-md focus:outline-hidden focus:ring-2 focus:ring-primary"
            >
              {showRePassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {errors.rePassword && (
            <p id="rePassword-error" role="alert" className="mt-1 text-xs text-red-600">
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
              Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-neutral-600">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-primary hover:underline focus:outline-hidden focus:ring-2 focus:ring-primary focus:ring-offset-1 rounded-xs"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}
