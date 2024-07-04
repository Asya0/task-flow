import {
	IsOptional,
	IsNumber,
	Min,
	Max,
	IsEmail,
	MinLength,
	IsString
} from 'class-validator'

export class PomodoroSettingsDto {
	@IsOptional() //мб передано, мб нет, тк в shema.prisma по умолчанию есть значения workInterval 50
	@IsNumber()
	@Min(1)
	workInterval?: number

	@IsOptional()
	@IsNumber()
	@Min(1)
	breakInterval?: number

	@IsOptional()
	@IsNumber()
	@Min(1)
	@Max(10) //макс кол-во кругов
	intervalsCount?: number
}
//класс для пользователя
export class UserDto extends PomodoroSettingsDto {
	//наследуется на основе PomodoroSettingsDto
	@IsOptional() //все поля опциональны, чтобы если захотели поменять только имя, то поменяли его, если email, то только  email
	@IsEmail()
	email: string

	@IsOptional()
	@MinLength(6, {
		message: 'Pasword must be at least 6 characters long'
	})
	@IsOptional()
	@IsString()
	password: string
}
