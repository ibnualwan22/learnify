import { PrismaClient } from "@prisma/client";

// Mencegah instansiasi PrismaClient berulang kali selama masa aktif development (HMR)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
