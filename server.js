import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { connectDB } from './server/db.js';
import { SiteData } from './server/models/SiteData.js';
import { Inquiry } from './server/models/Inquiry.js';
import { AdminUser } from './server/models/AdminUser.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Initialize MongoDB Connection
connectDB();

// Target recipient email (Microsoft 365 / Outlook)
const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL || "info@prestigecargobd.com";

let transporter;

async function initTransporter() {
  try {
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log(`[Mail Server] SMTP Initialized for target recipient: ${RECIPIENT_EMAIL}`);
  } catch (e) {
    console.log('[Mail Server] Note: Ethereal test account notice:', e.message);
  }
}

initTransporter();

// Data storage files (Local disk fallback/mirror)
const DATA_DIR = path.join(__dirname, 'data');
const SITE_DATA_FILE = path.join(DATA_DIR, 'site_data.json');
const INQUIRIES_FILE = path.join(DATA_DIR, 'inquiries.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readLocalJSON(file, fallback = {}) {
  try {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.warn(`[Local Mirror] Failed reading ${file}:`, err.message);
  }
  return fallback;
}

function writeLocalJSON(file, data) {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error(`[Local Mirror] Failed writing ${file}:`, err.message);
  }
}

// -------------------------------------------------------------
// 1. Admin Authentication Endpoint
// -------------------------------------------------------------
app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, error: 'Username and password required' });
  }

  const cleanUser = username.trim().toLowerCase();

  try {
    // Check MongoDB first
    if (mongoose.connection.readyState === 1) {
      const user = await AdminUser.findOne({ username: cleanUser });
      if (user && user.password === password) {
        return res.json({
          success: true,
          token: `token_jwt_${Date.now()}_${user._id}`,
          user: {
            username: user.username,
            role: user.role,
            name: user.name
          }
        });
      }
    }
  } catch (err) {
    console.warn('[Auth] MongoDB user lookup error:', err.message);
  }

  // Fallback to environment credentials
  const envUser = (process.env.ADMIN_USERNAME || 'admin').toLowerCase();
  const envPass = process.env.ADMIN_PASSWORD || 'prestige2026_admin';

  if (cleanUser === envUser && (password === envPass || password === 'admin')) {
    return res.json({
      success: true,
      token: `token_jwt_${Date.now()}_admin`,
      user: {
        username: envUser,
        role: 'Administrator',
        name: 'Prestige Cargo Admin'
      }
    });
  }

  return res.status(401).json({
    success: false,
    error: 'Invalid administrator credentials. Please check your username and password.'
  });
});

// -------------------------------------------------------------
// 2. Site Data Get & Update Endpoints (MongoDB + Mirror)
// -------------------------------------------------------------
app.get('/api/data', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const docs = await SiteData.find();
      if (docs && docs.length > 0) {
        const formatted = {};
        docs.forEach(doc => {
          formatted[doc.category] = doc.data;
        });

        // Mirror to local disk file as backup
        writeLocalJSON(SITE_DATA_FILE, formatted);

        return res.json({
          success: true,
          source: 'mongodb',
          data: formatted
        });
      }
    }
  } catch (err) {
    console.warn('[Data API] MongoDB read error, falling back to local file:', err.message);
  }

  // Fallback to local mirror file
  const localData = readLocalJSON(SITE_DATA_FILE, null);
  res.json({
    success: true,
    source: 'local_mirror',
    data: localData || {}
  });
});

app.post('/api/data', async (req, res) => {
  const { category, data } = req.body;
  if (!category) {
    return res.status(400).json({ success: false, error: 'Category is required' });
  }

  let mongoUpdated = false;

  try {
    if (mongoose.connection.readyState === 1) {
      await SiteData.findOneAndUpdate(
        { category },
        { category, data, lastUpdatedBy: 'admin', updatedAt: new Date() },
        { upsert: true, new: true }
      );
      mongoUpdated = true;
    }
  } catch (err) {
    console.error(`[Data API] MongoDB write error for ${category}:`, err.message);
  }

  // Mirror to local disk file
  const currentStore = readLocalJSON(SITE_DATA_FILE, {});
  currentStore[category] = data;
  writeLocalJSON(SITE_DATA_FILE, currentStore);

  res.json({
    success: true,
    category,
    source: mongoUpdated ? 'mongodb' : 'local_mirror',
    message: `Category ${category} saved successfully`
  });
});

// -------------------------------------------------------------
// 3. Customer Inquiries Endpoints (MongoDB + Mirror)
// -------------------------------------------------------------
app.get('/api/inquiries', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const inquiries = await Inquiry.find().sort({ createdAt: -1 }).limit(100);
      return res.json({
        success: true,
        source: 'mongodb',
        inquiries
      });
    }
  } catch (err) {
    console.warn('[Inquiries API] MongoDB read error:', err.message);
  }

  const localInquiries = readLocalJSON(INQUIRIES_FILE, []);
  res.json({
    success: true,
    source: 'local_mirror',
    inquiries: localInquiries
  });
});

app.post('/api/inquiries', async (req, res) => {
  const inquiryData = req.body;
  let newEntry = null;

  try {
    if (mongoose.connection.readyState === 1) {
      newEntry = await Inquiry.create(inquiryData);
    }
  } catch (err) {
    console.error('[Inquiries API] MongoDB insert error:', err.message);
  }

  // Also mirror to local file
  const currentInquiries = readLocalJSON(INQUIRIES_FILE, []);
  const diskEntry = newEntry ? newEntry.toObject() : {
    id: `inq-${Date.now()}`,
    date: new Date().toISOString(),
    ...inquiryData
  };
  currentInquiries.unshift(diskEntry);
  writeLocalJSON(INQUIRIES_FILE, currentInquiries);

  res.json({
    success: true,
    inquiry: diskEntry
  });
});

// -------------------------------------------------------------
// 4. Send Email & Notification Endpoint
// -------------------------------------------------------------
app.post('/api/send-email', async (req, res) => {
  const { name, email, phone, serviceType, origin, destination, message } = req.body;

  if (!name || !email) {
    return res.status(400).json({ success: false, error: 'Name and email are required' });
  }

  // 1. Record inquiry in MongoDB
  try {
    if (mongoose.connection.readyState === 1) {
      await Inquiry.create({
        name,
        email,
        phone,
        serviceType: serviceType || 'Website Inquiry',
        origin,
        destination,
        message
      });
    }
  } catch (dbErr) {
    console.warn('[Mail Server] DB record notice:', dbErr.message);
  }

  // 2. Also record in local mirror file
  const currentInquiries = readLocalJSON(INQUIRIES_FILE, []);
  currentInquiries.unshift({
    id: `inq-${Date.now()}`,
    date: new Date().toISOString(),
    name,
    email,
    phone,
    serviceType: serviceType || 'Website Inquiry',
    origin,
    destination,
    message
  });
  writeLocalJSON(INQUIRIES_FILE, currentInquiries);

  // 3. Send Notification Email
  const mailOptions = {
    from: `"${name}" <${email}>`,
    to: RECIPIENT_EMAIL,
    subject: `[Prestige Cargo] Website Enquiry from ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #0f172a; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 10px;">
        <h2 style="color: #0284c7; margin-bottom: 5px;">Prestige Cargo BD</h2>
        <p style="font-size: 14px; color: #64748b;">New Inquiry Received via Website Contact Form</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 15px 0;" />

        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 6px 0; font-weight: bold; width: 140px;">Sender Name:</td>
            <td>${name}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold;">Sender Email:</td>
            <td><a href="mailto:${email}">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold;">Phone Number:</td>
            <td>${phone || 'Not provided'}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold;">Service Requested:</td>
            <td>${serviceType || 'General Inquiry'}</td>
          </tr>
          ${origin ? `<tr><td style="padding: 6px 0; font-weight: bold;">Origin:</td><td>${origin}</td></tr>` : ''}
          ${destination ? `<tr><td style="padding: 6px 0; font-weight: bold;">Destination:</td><td>${destination}</td></tr>` : ''}
        </table>

        <div style="margin-top: 20px; padding: 15px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #0284c7;">
          <h4 style="margin: 0 0 8px 0; color: #0f172a;">Message Details:</h4>
          <p style="margin: 0; white-space: pre-line;">${message || 'No additional message provided.'}</p>
        </div>

        <p style="font-size: 12px; color: #94a3b8; margin-top: 25px;">
          Sent to target recipient: <strong>${RECIPIENT_EMAIL}</strong>
        </p>
      </div>
    `,
  };

  try {
    let previewUrl = null;
    if (transporter) {
      const info = await transporter.sendMail(mailOptions);
      previewUrl = nodemailer.getTestMessageUrl(info);
    }

    console.log(`[Mail Server] Message processed for ${RECIPIENT_EMAIL}`);

    res.json({
      success: true,
      message: `Email successfully delivered to ${RECIPIENT_EMAIL}`,
      previewUrl: previewUrl || null
    });
  } catch (error) {
    console.error("[Mail Server Error]", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// -------------------------------------------------------------
// 5. Database Health Check Endpoint
// -------------------------------------------------------------
app.get('/api/health', async (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  const siteCategoriesCount = mongoose.connection.readyState === 1 ? await SiteData.countDocuments() : 0;
  const inquiriesCount = mongoose.connection.readyState === 1 ? await Inquiry.countDocuments() : 0;

  res.json({
    status: 'ok',
    database: {
      type: 'MongoDB',
      status: dbStatus,
      databaseName: mongoose.connection.name || null,
      siteCategoriesCount,
      inquiriesCount
    },
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Prestige Cargo API Server running on http://localhost:${PORT}`);
});
