import { PrismaClient } from "@prisma/client";
import { Role } from "../enums/role.enum";

const prisma = new PrismaClient();

export class UserRepository {
  async create(username: string, hashedPassword: string, role: Role) {
    return prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role,
      },
    });
  }

  async findByUsername(username: string) {
    return prisma.user.findUnique({ where: { username } });
  }
}
