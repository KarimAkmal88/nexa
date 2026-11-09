import type {
  RegisterFormData,
  ResetPasswordFormData,
  ChangePasswordFormData,
} from "@/lib/validations/auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://ecommerce.routemisr.com";

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export async function registerUser(formData: RegisterFormData): Promise<ApiResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok || data.message !== "success") {
      const errorMessage =
        data.message === "fail" && data.errors?.param
          ? data.errors.msg
          : data.message || "Registration failed. Please check your details.";
      return {
        success: false,
        error: errorMessage,
      };
    }

    return {
      success: true,
      data,
    };
  } catch {
    return {
      success: false,
      error: "Unable to connect to the server. Please check your internet connection.",
    };
  }
}

export async function requestPasswordReset(email: string): Promise<ApiResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/auth/forgotPasswords`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok || (data.statusMsg !== "success" && data.message !== "Reset code sent to your email")) {
      return {
        success: false,
        error: data.message || "Failed to send reset code. Please verify the email address.",
      };
    }

    return {
      success: true,
      message: data.message || "Reset code sent to your email.",
    };
  } catch {
    return {
      success: false,
      error: "Unable to connect to the server. Please try again later.",
    };
  }
}

export async function verifyResetCode(resetCode: string): Promise<ApiResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/auth/verifyResetCode`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ resetCode }),
    });

    const data = await res.json();

    if (!res.ok || (data.status !== "Success" && data.statusMsg !== "success")) {
      return {
        success: false,
        error: data.message || "Reset code is invalid or has expired.",
      };
    }

    return {
      success: true,
      message: "Reset code verified successfully.",
    };
  } catch {
    return {
      success: false,
      error: "Unable to connect to the server. Please try again later.",
    };
  }
}

export async function resetPassword(formData: ResetPasswordFormData): Promise<ApiResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/auth/resetPassword`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok || !data.token) {
      return {
        success: false,
        error: data.message || "Failed to reset password. Please start the recovery process again.",
      };
    }

    return {
      success: true,
      message: "Password reset successfully. You can now log in.",
    };
  } catch {
    return {
      success: false,
      error: "Unable to connect to the server. Please try again later.",
    };
  }
}

export async function changeUserPassword(
  formData: ChangePasswordFormData,
  token: string
): Promise<ApiResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/users/changeMyPassword`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok || data.message !== "success") {
      const errorMessage =
        data.message || (data.errors ? "Invalid password details." : "Failed to change password.");
      return {
        success: false,
        error: errorMessage,
      };
    }

    return {
      success: true,
      data,
    };
  } catch {
    return {
      success: false,
      error: "Unable to connect to the server. Please try again later.",
    };
  }
}
