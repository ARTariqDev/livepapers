import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export async function POST(req) {
  try {
    const { name, username, email, password, googleEmail, image } = await req.json();

    if (!name || !username || !email || !password) {
      return NextResponse.json(
        { message: 'Please provide all required fields' },
        { status: 400 }
      );
    }

    await connectDB();

    const emailExists = await User.findOne({ email });

    if (emailExists) {
      return NextResponse.json(
        { message: 'User already exists with this email' },
        { status: 400 }
      );
    }

    const usernameExists = await User.findOne({ username });

    if (usernameExists) {
      return NextResponse.json(
        { message: 'Username is already taken' },
        { status: 400 }
      );
    }


    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      username,
      email,
      password: hashedPassword,
    };

    let linkToken;
    let linkTokenExpires;

    if (googleEmail) {
      userData.googleEmail = googleEmail;
      userData.image = image;
    } else {
      // Generate secure linking token valid for 5 minutes
      linkToken = crypto.randomBytes(32).toString('hex');
      linkTokenExpires = new Date(Date.now() + 5 * 60 * 1000);
      userData.linkToken = linkToken;
      userData.linkTokenExpires = linkTokenExpires;
    }


    const user = await User.create(userData);

    const response = NextResponse.json(
      { message: 'User registered successfully', userId: user._id, email: user.email },
      { status: 201 }
    );

    if (!googleEmail) {
      // Set HttpOnly cookie for NextAuth linking flow
      response.cookies.set('linking_token', linkToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 300,
        path: '/',
      });
    }

    return response;
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: 'An error occurred during registration' },
      { status: 500 }
    );
  }
}
