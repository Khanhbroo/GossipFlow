import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true, // Create index for userName, return results faster
      trim: true,
      lowercase: true,
    },
    hashedPassword: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
    },
    avatarUrl: {
      type: String, // Link CDN to display image
    },
    avatarId: {
      type: String, // Cloudinary public_id for handling image deletion
    },
    bio: {
      type: String,
      maxlength: 500, // Limit the content of bio to 500 characters
    },
    phone: {
      type: String,
      sparse: true, // Allow null value, but making sure that phone number is not duplicated when inserting
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
