import NextAuth from "next-auth";
import { authOptions } from "@/app/api/config/auth/authOptions";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };