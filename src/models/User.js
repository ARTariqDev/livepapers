import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      maxlength: [60, 'Name cannot be more than 60 characters'],
    },
    username: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple null/undefined values for OAuth users
      maxlength: [30, 'Username cannot be more than 30 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please fill a valid email address',
      ],
    },
    password: {
      type: String,
      required: false, // Not required for OAuth users (e.g. Google)
    },
    image: {
      type: String,
      required: false,
    },
    googleEmail: {
      type: String,
      unique: true,
      sparse: true,
    },
    linkToken: {
      type: String,
    },
    linkTokenExpires: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Prevent re-compilation of model in Next.js
export default mongoose.models.User || mongoose.model('User', UserSchema);
