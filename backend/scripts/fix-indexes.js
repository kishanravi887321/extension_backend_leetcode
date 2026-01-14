/**
 * One-time script to fix duplicate/conflicting indexes
 * Run with: node scripts/fix-indexes.js
 * Or with explicit URI: MONGO_URL=your_uri node scripts/fix-indexes.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Try loading .env from multiple possible locations
dotenv.config({ path: resolve(__dirname, '../.env') });
dotenv.config({ path: resolve(__dirname, '../../.env') });
dotenv.config();

const MONGODB_URI = process.env.MONGO_URL || process.env.MONGODB_URI || process.env.MONGO_URI;

if (!MONGODB_URI) {
  console.error('Error: No MongoDB URI found!');
  console.error('Please set MONGO_URL environment variable or create a .env file');
  console.error('Example: MONGO_URL=mongodb+srv://... node scripts/fix-indexes.js');
  process.exit(1);
}

async function fixIndexes() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('quests');

    // Get current indexes
    const indexes = await collection.indexes();
    console.log('Current indexes:', indexes.map(i => i.name));

    // Drop the conflicting unique compound index if it exists
    const indexToRemove = 'user_1_platform_1_questNumber_1';
    const indexExists = indexes.some(i => i.name === indexToRemove);

    if (indexExists) {
      console.log(`Dropping index: ${indexToRemove}`);
      await collection.dropIndex(indexToRemove);
      console.log('Index dropped successfully');
    } else {
      console.log(`Index ${indexToRemove} does not exist, skipping`);
    }

    // Also check for duplicate uniqueId index
    const uniqueIdIndexes = indexes.filter(i => 
      i.key && i.key.uniqueId === 1
    );
    console.log('UniqueId indexes found:', uniqueIdIndexes.length);

    // Get updated indexes
    const updatedIndexes = await collection.indexes();
    console.log('Updated indexes:', updatedIndexes.map(i => i.name));

    console.log('Done!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

fixIndexes();
