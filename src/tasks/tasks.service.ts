import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto, userId: number) {
    try {
      return await this.prisma.task.create({
        data: {
          ...createTaskDto,
          userId,
        },
      });
    } catch {
      throw new BadRequestException('Error al crear la tarea');
    }
  }

  async findAll(userId: number) {
    return this.prisma.task.findMany({ where: { userId } });
  }

  async findOne(id: number, userId: number) {
    const task = await this.prisma.task.findFirst({ where: { id, userId } });
    if (!task) throw new NotFoundException('Tarea no encontrada');
    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto, userId: number) {
    const task = await this.findOne(id, userId);
    return this.prisma.task.update({
      where: { id: task.id },
      data: updateTaskDto,
    });
  }

  async remove(id: number, userId: number) {
    const task = await this.findOne(id, userId);
    return this.prisma.task.delete({ where: { id: task.id } });
  }
}
