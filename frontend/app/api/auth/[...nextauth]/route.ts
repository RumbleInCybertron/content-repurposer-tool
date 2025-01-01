import NextAuth from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { getServerSession } from "next-auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

export async function getSession() {
  return getServerSession(authOptions);
}