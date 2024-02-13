import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
//   const connor = await prisma.user.upsert({
//       where: {email: 'sample@gmail.com'},
//       update: {},
//       create: {
//           email: 'family@mailinator.com',
//           name: "Family",
//       }
//   })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })