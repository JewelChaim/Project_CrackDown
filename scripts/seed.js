const { PrismaClient, Role } = require("@prisma/client");
const prisma = new PrismaClient();
async function main() {
  await prisma.user.upsert({
    where: { email: "admin@jewelhc.com" },
    update: {},
    create: { email: "admin@jewelhc.com", name: "Admin", role: Role.ADMIN },
  });
  console.log("Seeded admin@jewelhc.com");
}
main().then(()=>process.exit(0)).catch(e=>{console.error(e);process.exit(1);});
