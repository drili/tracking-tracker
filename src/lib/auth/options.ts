import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/user";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    scope: "openid email profile https://www.googleapis.com/auth/analytics.readonly https://www.googleapis.com/auth/analytics.manage.users.readonly https://www.googleapis.com/auth/analytics.edit",
                },
            },
        })
    ],
    pages: {
        signIn: "/login"
    },
    debug: true,
    callbacks: {
        async signIn({ user }) {
            await connectDB()

            const existingUser = await User.findOne({ email: user.email })

            if (!existingUser) {
                await User.create({
                    name: user.name,
                    email: user.email,
                    image: user.image,
                })
                console.log("::: ✅ Created new user:", user.email)
            } else {
                console.log("::: 🔁 User already exists:", user.email)
            }

            return true
        },

        async jwt({ token, account }) {
            if (account?.provider === "google") {
                token.accessToken = account.access_token
            }

            return token
        },

        async session({ session, token }) {
            if (token?.accessToken) {
                session.accessToken = token.accessToken
            }

            return session
        }
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
}