import mongoose from 'mongoose';

const InquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      trim: true
    },
    serviceType: {
      type: String,
      default: 'General Freight Inquiry'
    },
    origin: {
      type: String,
      trim: true
    },
    destination: {
      type: String,
      trim: true
    },
    message: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ['new', 'in_progress', 'quoted', 'archived'],
      default: 'new'
    }
  },
  { timestamps: true }
);

export const Inquiry = mongoose.models.Inquiry || mongoose.model('Inquiry', InquirySchema);
