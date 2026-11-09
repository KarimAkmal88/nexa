import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      role?: string | null;
    } & DefaultSession["user"];
    token?: string;
  }

  interface User {
    id?: string;
    name?: string;
    email?: string;
    role?: string;
    token?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    token?: string;
    role?: string;
    user?: {
      name?: string;
      email?: string;
      role?: string;
    };
  }
}
