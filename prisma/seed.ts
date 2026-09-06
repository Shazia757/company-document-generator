import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash("Admin@12345", 12);

  await prisma.user.upsert({
    where: {
      email: "admin@example.com",
    },
    update: {
      passwordHash,
    },
    create: {
      name: "Admin",
      email: "admin@example.com",
      passwordHash,
    },
  });

  console.log("Admin user created.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());