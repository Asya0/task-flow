import { Injectable } from '@nestjs/common'
import { AuthDto } from 'src/auth/dto/auth.dto'
import { PrismaService } from 'src/prisma.service'
import { hash } from 'argon2'
import { UserDto } from './user.dto'

import { startOfDay, subDays } from 'date-fns'

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	async getById(id: string) {
		return this.prisma.user.findUnique({
			where: {
				id
			},
			include: {
				tasks: true
			}
		})
	}

	getByEmail(email: string) {
		return this.prisma.user.findUnique({
			where: {
				email
			}
		})
	}

	async getProfile(id: string) {
		//пригодится при написании статистики, статистика будет брать отсюда данные
		const profile = await this.getById(id)

		//не будем создавать отдельную сущность, создадим статистику здесь
		const totalTasks = profile.tasks.length
		const completedTasks = await this.prisma.task.count({
			//так делать не стоит(обращаться напрямую к task)
			where: {
				userId: id,
				isCompleted: true
			}
		})

		//использование даты при создании запросов prisma
		const todayStart = startOfDay(new Date()) //получаем дату сегодняшнего дня
		const weekStart = startOfDay(subDays(new Date(), 7))

		const todayTasks = await this.prisma.task.count({
			where: {
				userId: id,
				createdAt: {
					gte: todayStart.toISOString()
				}
			}
		})

		const weekTasks = await this.prisma.task.count({
			where: {
				userId: id,
				createdAt: {
					gte: weekStart.toISOString()
				}
			}
		})

		const { password, ...rest } = profile

		return {
			user: rest,
			statistics: [
				//чтобы было красиво выводим массивом
				{ label: 'Всего задач ', value: totalTasks },
				{ label: 'Выполнено ', value: completedTasks },
				{ label: 'Сегодня ', value: todayTasks },
				{ label: 'Неделя ', value: weekTasks }
			]
		}
	}

	async create(dto: AuthDto) {
		const user = {
			email: dto.email,
			name: '',
			password: await hash(dto.password)
		}
		return this.prisma.user.create({
			data: user
		})
	}

	async update(id: string, dto: UserDto) {
		let data = dto

		if (dto.password) {
			data = { ...dto, password: await hash(dto.password) } //если пароль не пришел, то хэшируем по новой
		}

		return this.prisma.user.update({
			where: {
				id
			},
			data,
			select: {
				name: true,
				email: true
			}
		})
	}
}
