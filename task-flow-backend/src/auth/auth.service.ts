import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserService } from 'src/user/user.service'
import { AuthDto } from './dto/auth.dto'
import { verify } from 'argon2'
import { Response } from 'express'

@Injectable()
export class AuthService {
	EXPIRE_DAY_REFRESH_TOKEN = 1 //будет действовать 1 день
	REFRESH_TOKEN_NAME = 'refreshToken'

	constructor(
		private jwt: JwtService, //чтобы расшифровать токен
		private userService: UserService // чтобы могли обращаться к юзеру
	) {}

	async login(dto: AuthDto) {
		const { password, ...user } = await this.validateUser(dto)
		const tokens = this.issueTokens(user.id)

		return {
			user,
			...tokens
		}
	}
	//метод создания новых токенов
	async getNewTokens(refreshToken: string) {
		const result = await this.jwt.verifyAsync(refreshToken)
		if (!result) throw new UnauthorizedException('Invalid refresh token')

		const { password, ...user } = await this.userService.getById(result.id)

		const tokens = this.issueTokens(user.id)

		return {
			user,
			...tokens
		}
	}

	async register(dto: AuthDto) {
		const oldUser = await this.userService.getByEmail(dto.email)

		if (oldUser) throw new BadRequestException('User already exists')
		//password не ошибка, пусть подчеркивает
		const { password, ...user } = await this.userService.create(dto)

		const tokens = this.issueTokens(user.id)

		return {
			user,
			...tokens
		}
	}

	private issueTokens(userId: string) {
		//метод генерации токена
		const data = { id: userId }

		const accessToken = this.jwt.sign(data, {
			//отвечает за запросы к серверу
			expiresIn: '1h'
		})

		const refreshToken = this.jwt.sign(data, {
			// используется для обновления токена
			expiresIn: '7d'
		})
		return { accessToken, refreshToken }
	}
	private async validateUser(dto: AuthDto) {
		//метод проверки данных пользователя
		const user = await this.userService.getByEmail(dto.email)

		if (!user) throw new NotFoundException('User not found')

		const isValid = await verify(user.password, dto.password)

		if (!isValid) throw new UnauthorizedException('Invalid password')

		return user
	}
	//функция для добавления куков
	addRefreshTokenToResponse(res: Response, refreshToken: string) {
		//response от express, иначе не подхватит cookie
		const expiresIn = new Date()
		expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN)

		res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
			httpOnly: true,
			domain: 'localhost',
			expires: expiresIn, //дата окончания токена
			secure: true, //то что хуки будет https
			sameSite: 'none'
		})
	}

	//функция для удаления куков
	removeRefreshTokenToResponse(res: Response) {
		//response от express, иначе не подхватит cookie
		const expiresIn = new Date()
		expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN)

		res.cookie(this.REFRESH_TOKEN_NAME, '', {
			httpOnly: true,
			domain: 'localhost',
			expires: new Date(0), //обнуляем дату токена
			secure: true, //то что хуки будет https
			sameSite: 'none'
		})
	}
}
