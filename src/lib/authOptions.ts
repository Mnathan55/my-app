import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "./prisma";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // Google login
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // User login
    CredentialsProvider({
      id: "user-login",
      name: "User",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter both email and password");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("No user found with this email");
        }

        if (!user.password) throw new Error("Invalid email or password"); // <-- added
const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error("Invalid password");
        }

        return { id: user.id,
  name: user.name,
  email: user.email,
  image: user.image,};
      },
    }),

    // Admin login
    CredentialsProvider({
      id: "admin-login",
      name: "Admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Missing email or password");
        }

        const admin = await prisma.admin.findUnique({
          where: { email: credentials.email },
        });

        if (!admin) {
          throw new Error("No admin found with that email");
        }

        if (!admin.password) throw new Error("Invalid email or password"); // <-- added
const isValid = await bcrypt.compare(credentials.password, admin.password);


        if (!isValid) {
          throw new Error("Invalid password");
        }

        return {
          id: admin.id,
          name: admin.name || "Admin",
          email: admin.email,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.picture as string | null;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    signOut: "/",
    error: "/auth/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
};
