import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Hash password
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create a test user
  let user = await prisma.user.findUnique({ where: { email: 'test@example.com' } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        password: hashedPassword,
        name: 'Test User',
      },
    });
  }

  console.log('Created user:', user.email);

  // Create sample tasks
  const task1 = await prisma.task.create({
    data: {
      title: 'Complete project setup',
      description: 'Set up NestJS backend with Prisma and authentication',
      done: true,
      ownerId: user.id,
    },
  });

  const task2 = await prisma.task.create({
    data: {
      title: 'Build frontend',
      description: 'Create React frontend with Tailwind CSS',
      done: false,
      ownerId: user.id,
    },
  });

  console.log('Created tasks:', task1.title, task2.title);
  console.log('Seed completed successfully!');
  console.log('\nTest credentials:');
  console.log('Email: test@example.com');
  console.log('Password: password123');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
