import mongoose from "mongoose";

type IUser = {
  username: string;
  password: string;
};

const userSchema = new mongoose.Schema<IUser>({
  username: {
    type: String,
    required: [true, "Please enter a username"],
    unique: true,
    trim: true,
    minlength: [3, "Username must be at least 3 characters long"],
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [6, "Password must be at least 6 characters long"],
  },
});

export default mongoose.model<IUser>("User", userSchema);
