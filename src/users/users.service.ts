import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  // 🟢 Crear usuario con contraseña encriptada
  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      return await this.prisma.user.create({
        data: {
          ...createUserDto,
          password: hashedPassword,
        },
      });
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Error al crear usuario',
      );
    }
  }

  // 🟢 Obtener todos los usuarios
  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  // 🟢 Obtener usuario por ID
  async findOne(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  // 🟢 Buscar usuario por email (para login con JWT)
  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  // 🟢 Actualizar usuario (rehash si cambia la contraseña)
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      if (updateUserDto.password) {
        updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
      }

      return await this.prisma.user.update({
        where: { id },
        data: updateUserDto,
      });
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Error al actualizar usuario',
      );
    }
  }

  // 🟢 Eliminar usuario
  async remove(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    return this.prisma.user.delete({ where: { id } });
  }
}
