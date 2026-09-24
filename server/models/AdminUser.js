import mongoose from 'mongoose';

const AdminUserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      default: 'Administrator'
    },
    name: {
      type: String,
      default: 'Prestige Cargo Admin'
    }
  },
  { timestamps: true }
);

export const AdminUser = mongoose.models.AdminUser || mongoose.model('AdminUser', AdminUserSchema);
