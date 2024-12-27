import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const newUser = await prisma.user.create({
    data: {
      email: 'testuser@example.com',
      name: 'Test User',
    },
  });

  console.log('Created User:', newUser);

  const allUsers = await prisma.user.findMany();
  console.log('All Users:', allUsers);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
