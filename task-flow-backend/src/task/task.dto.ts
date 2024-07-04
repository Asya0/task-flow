import { Priority } from '@prisma/client'
import { Transform } from 'class-transformer'
import { IsOptional, IsString, IsBoolean, IsEnum } from 'class-validator'

//класс для пользователя
export class TaskDto {
	//наследуется на основе PomodoroSettingsDto
	@IsString()
	@IsOptional()
	name: string

	@IsBoolean()
	@IsOptional()
	isCompleted?: boolean

	@IsString()
	@IsOptional()
	createdAt?: string

	@IsEnum(Priority) //плюс призмы - подготовила нам готовый enum
	@IsOptional()
	@Transform(({ value }) => ('' + value).toLowerCase())
	priority: Priority
}
