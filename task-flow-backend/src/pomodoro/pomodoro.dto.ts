import { IsOptional, IsBoolean, IsNumber } from 'class-validator'

//класс для пользователя
export class PomodoroSessionDto {
	@IsBoolean()
	@IsOptional()
	isCompleted?: boolean
}

export class PomodoroRoundDto {
	//сколько секунд прошло
	@IsNumber()
	totalSeconds?: number

	@IsBoolean()
	@IsOptional()
	isCompleted?: boolean
}
