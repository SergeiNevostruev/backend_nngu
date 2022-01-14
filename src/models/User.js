import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 40,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 60,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    refreshToken: {
      type: String,
    },
    tokenCount: {
      type: String,
    },
    tokenDevice: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('User', UserSchema);
