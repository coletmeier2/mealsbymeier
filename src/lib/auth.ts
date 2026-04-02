import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (
          typeof credentials?.email !== "string" ||
          typeof credentials?.password !== "string" ||
          !process.env.ADMIN_EMAIL ||
          !process.env.ADMIN_PASSWORD_HASH
        ) {
          return null
        }

        if (credentials.email !== process.env.ADMIN_EMAIL) {
          return null
        }

        const valid = await bcrypt.compare(
          credentials.password,
          process.env.ADMIN_PASSWORD_HASH
        )

        if (!valid) return null

        return { id: "admin", email: credentials.email, name: "Admin" }
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
})
