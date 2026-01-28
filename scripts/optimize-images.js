#!/usr/bin/env node
/**
 * Manna Kitchen Image Optimizer
 *
 * Usage: npm run images -- [input-directory]
 * Default: processes images from ./images-to-upload/
 *
 * This script:
 * 1. Reads all images from input directory
 * 2. Resizes to thumbnail (320px), medium (640px), full (1024px)
 * 3. Converts to WebP (primary) and JPEG (fallback)
 * 4. Uploads to Cloudflare R2
 * 5. Outputs the URLs to use in products.json/meals.json
 */

import sharp from 'sharp';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { readdir, readFile } from 'fs/promises';
import { join, basename, extname } from 'path';

// Configuration
const sizes = {
  thumbnail: 320,
  medium: 640,
  full: 1024
};

const formats = [
  { name: 'webp', quality: 80, mime: 'image/webp' },
  { name: 'jpeg', quality: 85, mime: 'image/jpeg' }
];

// R2 client setup
const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY
  }
});

async function processImage(inputPath, outputName) {
  const results = [];
  const image = sharp(inputPath);

  for (const [sizeName, width] of Object.entries(sizes)) {
    for (const format of formats) {
      const key = `${outputName}-${sizeName}.${format.name}`;

      const buffer = await image
        .clone()
        .resize(width, null, { withoutEnlargement: true })
        [format.name]({ quality: format.quality })
        .toBuffer();

      await r2.send(new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: format.mime
      }));

      results.push(key);
      console.log(`  Uploaded: ${key}`);
    }
  }

  return results;
}

async function main() {
  // Check environment variables
  const required = ['R2_ACCOUNT_ID', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_BUCKET_NAME'];
  const missing = required.filter(key => !process.env[key]);
  if (missing.length > 0) {
    console.error('Missing environment variables:', missing.join(', '));
    console.error('Copy .env.example to .env and fill in your R2 credentials');
    process.exit(1);
  }

  const inputDir = process.argv[2] || './images-to-upload';

  console.log(`Processing images from: ${inputDir}`);
  console.log('');

  try {
    const files = await readdir(inputDir);
    const imageFiles = files.filter(f =>
      ['.jpg', '.jpeg', '.png', '.webp'].includes(extname(f).toLowerCase())
    );

    if (imageFiles.length === 0) {
      console.log('No images found. Add images to', inputDir);
      return;
    }

    const baseUrl = `https://${process.env.R2_BUCKET_NAME}.${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;

    console.log('Processing', imageFiles.length, 'images...');
    console.log('');

    for (const file of imageFiles) {
      const inputPath = join(inputDir, file);
      const outputName = basename(file, extname(file));

      console.log(`Processing: ${file}`);
      await processImage(inputPath, outputName);

      // Print the URL to use in JSON
      console.log(`  Use in JSON: "${baseUrl}/${outputName}-medium.webp"`);
      console.log('');
    }

    console.log('Done! Update your products.json/meals.json with the URLs above.');

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
