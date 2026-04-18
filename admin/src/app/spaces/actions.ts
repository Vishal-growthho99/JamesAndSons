'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function addProductToSpace(spaceId: string, productId: string) {
  try {
    await prisma.space.update({
      where: { id: spaceId },
      data: {
        products: {
          connect: { id: productId }
        }
      }
    });
    revalidatePath('/spaces');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function removeProductFromSpace(spaceId: string, productId: string) {
  try {
    await prisma.space.update({
      where: { id: spaceId },
      data: {
        products: {
          disconnect: { id: productId }
        }
      }
    });
    revalidatePath('/spaces');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
