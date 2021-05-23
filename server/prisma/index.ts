// eslint-disable-next-line @typescript-eslint/no-explicit-any
const globalAny: any = global;

import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({ errorFormat: 'minimal' });
} else {
  if (!globalAny.prisma) {
    globalAny.prisma = new PrismaClient({ errorFormat: 'minimal' });
  }
  prisma = globalAny.prisma;
}
export default prisma;
