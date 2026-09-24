import mongoose from 'mongoose';
import { SiteData } from './models/SiteData.js';
import { AdminUser } from './models/AdminUser.js';
import {
  defaultCompanyData,
  defaultHeroSlidesData,
  defaultIndustriesData,
  defaultServicesData,
  defaultTrackingData,
  defaultTradeLanesData
} from '../src/data/defaultSiteData.js';

export async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/prestige_cargo';

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`🍃 [MongoDB] Connected successfully to database: ${mongoose.connection.name}`);

    // Seed initial data if collection is empty
    await seedDefaultData();
    return true;
  } catch (err) {
    console.warn(`⚠️ [MongoDB] Connection error (${err.message}). Running with local backup store.`);
    return false;
  }
}

async function seedDefaultData() {
  try {
    const existingCount = await SiteData.countDocuments();
    if (existingCount === 0) {
      console.log('🌱 [MongoDB] Seeding initial Prestige Cargo site data into MongoDB...');
      const seedItems = [
        { category: 'companyData', data: defaultCompanyData },
        { category: 'heroSlidesData', data: defaultHeroSlidesData },
        { category: 'industriesData', data: defaultIndustriesData },
        { category: 'servicesData', data: defaultServicesData },
        { category: 'tradeLanesData', data: defaultTradeLanesData },
        { category: 'trackingData', data: defaultTrackingData }
      ];

      for (const item of seedItems) {
        await SiteData.create(item);
      }
      console.log('✅ [MongoDB] Initial site categories seeded successfully.');
    }

    // Seed default admin user if not present
    const defaultUser = process.env.ADMIN_USERNAME || 'admin';
    const defaultPass = process.env.ADMIN_PASSWORD || 'prestige2026_admin';
    const adminExists = await AdminUser.findOne({ username: defaultUser.toLowerCase() });
    if (!adminExists) {
      await AdminUser.create({
        username: defaultUser.toLowerCase(),
        password: defaultPass,
        role: 'Administrator',
        name: 'Prestige Cargo Admin'
      });
      console.log(`✅ [MongoDB] Default admin user '${defaultUser}' seeded.`);
    }
  } catch (err) {
    console.error('❌ [MongoDB] Error during seeding:', err.message);
  }
}
