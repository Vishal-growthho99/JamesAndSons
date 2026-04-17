import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env.local') });

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const prisma = new PrismaClient();

async function migrate() {
  console.log('Starting image migration to Cloudinary...');

  if (!process.env.CLOUDINARY_API_SECRET) {
    console.error('Error: CLOUDINARY_API_SECRET is missing. Please add it to your .env.local');
    return;
  }

  // 1. Products
  const products = await prisma.product.findMany({
    select: { id: true, images: true, name: true }
  });

  for (const product of products) {
    const updatedImages: string[] = [];
    let changed = false;

    for (const imgUrl of product.images) {
      if (imgUrl.includes('res.cloudinary.com')) {
        updatedImages.push(imgUrl);
        continue;
      }

      try {
        console.log(`Uploading product image for ${product.name}: ${imgUrl}`);
        const result = await cloudinary.uploader.upload(imgUrl, {
          folder: 'products',
        });
        updatedImages.push(result.secure_url);
        changed = true;
      } catch (error) {
        console.error(`Failed to upload ${imgUrl}:`, error);
        updatedImages.push(imgUrl); // Keep original if failed
      }
    }

    if (changed) {
      await prisma.product.update({
        where: { id: product.id },
        data: { images: updatedImages }
      });
      console.log(`Updated product: ${product.name}`);
    }
  }

  // 2. Variants
  const variants = await prisma.productVariant.findMany({
    select: { id: true, images: true, name: true }
  });

  for (const variant of variants) {
    const updatedImages: string[] = [];
    let changed = false;

    for (const imgUrl of variant.images) {
      if (imgUrl.includes('res.cloudinary.com')) {
        updatedImages.push(imgUrl);
        continue;
      }

      try {
        console.log(`Uploading variant image for ${variant.name}: ${imgUrl}`);
        const result = await cloudinary.uploader.upload(imgUrl, {
          folder: 'products/variants',
        });
        updatedImages.push(result.secure_url);
        changed = true;
      } catch (error) {
        console.error(`Failed to upload ${imgUrl}:`, error);
        updatedImages.push(imgUrl);
      }
    }

    if (changed) {
      await prisma.productVariant.update({
        where: { id: variant.id },
        data: { images: updatedImages }
      });
      console.log(`Updated variant: ${variant.name}`);
    }
  }

  console.log('Migration complete!');
  await prisma.$disconnect();
}

migrate().catch(e => {
  console.error(e);
  process.exit(1);
});
