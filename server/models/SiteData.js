import mongoose from 'mongoose';

const SiteDataSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    lastUpdatedBy: {
      type: String,
      default: 'admin'
    }
  },
  { timestamps: true }
);

export const SiteData = mongoose.models.SiteData || mongoose.model('SiteData', SiteDataSchema);
