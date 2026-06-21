// lib/prisma.js
import { PrismaClient } from '@prisma/client'

// In development herlaadt Next.js modules vaak (hot reload).
// Zonder deze globale cache zou je telkens een nieuwe PrismaClient
// aanmaken en uiteindelijk te veel database-connecties openen.
const globalForPrisma = globalThis

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
