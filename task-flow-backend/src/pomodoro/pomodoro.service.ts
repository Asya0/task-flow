import { Injectable } from '@nestjs/common'
import { NotFoundException } from '@nestjs/common/exceptions'
import { PrismaService } from 'src/prisma.service'
import { PomodoroRoundDto, PomodoroSessionDto } from './pomodoro.dto'

@Injectable()
export class PomodoroService {
	constructor(private prisma: PrismaService) {}

	async getTodaySession(userId: string) {
		const today = new Date().toISOString().split('T')[0]

		return this.prisma.pomodoroSession.findFirst({
			where: {
				createdAt: {
					gte: new Date(today) //gte - это больше или равно
				},
				userId: userId
			},
			include: {
				rounds: {
					orderBy: {
						id: 'asc'
					}
				}
			}
		})
	}

	async create(userId: string) {
		const todaySession = await this.getTodaySession(userId)

		if (todaySession) return todaySession //если сессия уже есть то просто вернуть ее

		//лучше вот так напрямую к юзеру не обращаться
		const user = await this.prisma.user.findUnique({
			//получаем уникального юзера по userId
			where: {
				id: userId
			},
			select: {
				intervalsCount: true
			}
		})

		if (!user) throw new NotFoundException('Данный пользователь не найден')

		return this.prisma.pomodoroSession.create({
			data: {
				rounds: {
					createMany: {
						data: Array.from({ length: user.intervalsCount }, () => ({
							totalSeconds: 0
						}))
					}
				},
				user: {
					connect: {
						id: userId
					}
				}
			},
			include: {
				rounds: true
			}
		})
	}

	async update(
		dto: Partial<PomodoroSessionDto>,
		pomodoroId: string,
		userId: string
	) {
		return this.prisma.pomodoroSession.update({
			where: {
				userId,
				id: pomodoroId
			},
			data: dto
		})
	}

	async updateRound(dto: Partial<PomodoroRoundDto>, roundId: string) {
		return this.prisma.pomodoroRound.update({
			where: {
				id: roundId
			},
			data: dto
		})
	}

	//не удаляем раунды, только сессии, тк раунды просто обнуляются с помощью update
	async deleteSession(sessionId: string, userId: string) {
		return this.prisma.pomodoroSession.delete({
			where: {
				id: sessionId,
				userId
			}
		})
	}
}
