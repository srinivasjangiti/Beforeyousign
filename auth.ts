import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';

/**
 * NextAuth Configuration
 * 
 * Supports:
 * - GitHub OAuth
 * - Google OAuth
 * - Email/Password credentials
 * 
 * Production TODO:
 * - Add database adapter for user persistence
 * - Implement email verification
 * - Add password reset flow
 */

// Mock user database - Replace with real database in production
const users = new Map<string, {
  id: string;
  name: string;
  email: string;
  password?: string; // hashed
  image?: string;
  emailVerified?: Date;
}>();

// Initialize with a test user (password: "password123")
// Hash generated with bcryptjs.hash("password123", 10)
users.set('test@example.com', {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  password: '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  emailVerified: new Date(),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      name: 'Email and Password',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'you@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter both email and password');
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        // Find user in mock database
        const user = users.get(email);
        if (!user) {
          throw new Error('No user found with this email');
        }

        // Verify password
        if (!user.password) {
          throw new Error('Please use OAuth to sign in');
        }

        const isValid = await compare(password, user.password);
        if (!isValid) {
          throw new Error('Invalid password');
        }

        // Return user object (will be stored in JWT)
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
    newUser: '/auth/welcome',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.provider = account?.provider;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      // Store OAuth users in mock database
      if (account?.provider !== 'credentials' && user.email) {
        if (!users.has(user.email)) {
          users.set(user.email, {
            id: user.id || crypto.randomUUID(),
            name: user.name || 'Anonymous',
            email: user.email,
            image: user.image,
            emailVerified: new Date(),
          });
        }
      }
      return true;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.AUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
});

/**
 * Helper function to register a new user
 * In production, this should be an API route with proper validation
 */
export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  const { hash } = await import('bcryptjs');
  
  // Check if user already exists
  if (users.has(data.email)) {
    throw new Error('User already exists with this email');
  }

  // Hash password
  const hashedPassword = await hash(data.password, 10);

  // Create user
  const user = {
    id: crypto.randomUUID(),
    name: data.name,
    email: data.email,
    password: hashedPassword,
    emailVerified: undefined, // Require email verification in production
  };

  users.set(data.email, user);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

/**
 * Helper to get all users (for testing/debugging only)
 * Remove in production
 */
export function getAllUsers() {
  return Array.from(users.values()).map(({ password, ...user }) => user);
}
