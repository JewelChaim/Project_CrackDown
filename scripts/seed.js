const { PrismaClient, Role } = require("@prisma/client");
const databaseUrl = process.env.DATABASE_URL ?? "file:./dev.db";
const prisma = new PrismaClient({ datasources: { db: { url: databaseUrl } } });
async function main() {
  await prisma.user.upsert({
    where: { email: "admin@jewelhc.com" },
    update: {},
    create: { email: "admin@jewelhc.com", name: "Admin", role: Role.ADMIN },
  });
  console.log("Seeded admin@jewelhc.com");
}
main().then(()=>process.exit(0)).catch(e=>{console.error(e);process.exit(1);});
