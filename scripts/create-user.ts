import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Creating test user...');

  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const existingUser = await prisma.user.findUnique({
    where: { email: 'user1@example.com' }
  });

  if (existingUser) {
    console.log('⚠️  User already exists!');
    const updateUser = await prisma.user.update({
      where: { email: 'user1@example.com' },
      data: { password: hashedPassword }
    });
    console.log('✅ Password updated');
    return;
  }

  const user = await prisma.user.create({
    data: {
      email: 'user1@example.com',
      name: 'Test User',
      password: hashedPassword,
      kycStatus: 'PENDING',
    },
  });
  
  console.log('✅ User created successfully!');
  console.log('Email: user1@example.com');
  console.log('Password: password123');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
