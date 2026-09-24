// db.js - MongoDB Connection helper
import { MongoClient } from 'mongodb';
import { connectDB } from './server/db.js';

export { MongoClient, connectDB };
export default connectDB;
