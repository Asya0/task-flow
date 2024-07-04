import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { TaskDto } from './task.dto'

@Injectable()
export class TaskService {
	constructor(private prisma: PrismaService) {}

	//получаем все задачи текущего пользователя
	async getAll(userId: string) {
		return this.prisma.task.findMany({
			//получаем много тасок, в которых одинаковы	 userId
			where: {
				userId
			}
		})
	}
	//создание задачи
	async create(dto: TaskDto, userId: string) {
		return this.prisma.task.create({
			data: {
				...dto,
				user: {
					connect: {
						//утилита коннект
						id: userId
					}
				}
			}
		})
	}
	//обновление задачи
	async update(dto: Partial<TaskDto>, taskId: string, userId: string) {
		return this.prisma.task.update({
			//сравниваем id юзера и id задачи
			where: {
				userId,
				id: taskId
			},
			data: dto
		})
	}
	//удаление задачи
	async delete(taskId: string) {
		return this.prisma.task.delete({
			where: {
				id: taskId
			}
		})
	}
}
