import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { cookies } from 'next/headers';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        identifier: { label: 'Email or Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await connectDB();

        const user = await User.findOne({
          $or: [
            { email: credentials.identifier },
            { username: credentials.identifier }
          ]
        });

        if (!user || !user.password) {
          throw new Error('Invalid email or password');
        }

        const isPasswordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordMatch) {
          throw new Error('Invalid email or password');
        }

        return { id: user._id.toString(), name: user.name, username: user.username, email: user.email, image: user.image };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === 'google') {
        try {
          await connectDB();
          const cookieStore = await cookies();
          const linkingTokenVal = cookieStore.get('linking_token')?.value;

          if (linkingTokenVal) {
            // Secure link flow
            const existingUser = await User.findOne({
              linkToken: linkingTokenVal,
              linkTokenExpires: { $gt: new Date() },
            });

            if (existingUser) {
              // Check if Google account is already linked to another user
              const googleUserExists = await User.findOne({ googleEmail: profile.email });
              if (googleUserExists && googleUserExists._id.toString() !== existingUser._id.toString()) {
                return `/login?error=GoogleAlreadyLinked`;
              }

              existingUser.googleEmail = profile.email;
              existingUser.linkToken = undefined;
              existingUser.linkTokenExpires = undefined;
              await existingUser.save();

              // Clear linking token cookie
              cookieStore.set('linking_token', '', { maxAge: 0 });
              return true;
            }
          }

          // Regular Google sign-in / signup flow
          let userExists = await User.findOne({ googleEmail: profile.email });
          if (userExists) {
            return true;
          }

          // Auto-link if same email and googleEmail not set
          userExists = await User.findOne({ email: profile.email });
          if (userExists) {
            userExists.googleEmail = profile.email;
            await userExists.save();
            return true;
          }

          // If no account exists, redirect back to signup page to set a password
          const nameEnc = encodeURIComponent(user.name || '');
          const emailEnc = encodeURIComponent(profile.email || user.email || '');
          const imageEnc = encodeURIComponent(user.image || '');
          return `/signup?error=NoAccountFound&email=${emailEnc}&name=${nameEnc}&image=${imageEnc}`;
        } catch (error) {
          console.error('Google Sign-In Error:', error);
          return false;
        }
      }
      return true; 
    },
    async jwt({ token, user, account }) {
      if (account && account.provider === 'google') {
        try {
          await connectDB();
          const dbUser = await User.findOne({
            $or: [
              { googleEmail: token.email },
              { email: token.email }
            ]
          });
          if (dbUser) {
            token.id = dbUser._id.toString();
            token.username = dbUser.username;
            token.name = dbUser.name;
            token.email = dbUser.email;
            token.image = dbUser.image;
          }
        } catch (error) {
          console.error('JWT Google Lookup Error:', error);
        }
      } else if (user) {
        token.id = user.id;
        token.username = user.username;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.image = token.image;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback_secret_for_development',
  pages: {
    signIn: '/login',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
