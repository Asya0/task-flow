import {
	Body,
	Controller,
	Get,
	HttpCode,
	UsePipes,
	ValidationPipe,
	Put
} from '@nestjs/common'
import { UserService } from './user.service'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { UserDto } from './user.dto'

@Controller('user/profile')
export class UserController {
	constructor(private readonly userService: UserService) {}
	//доступ к профилю юзера
	@Get() //POST-запрос на получение
	@Auth() //чтобы запрос был авторизированным
	async profile(@CurrentUser('id') id: string) {
		return this.userService.getProfile(id)
	}
	//обновление профиля юзера
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put() //на обновление
	@Auth()
	async updateProfile(@CurrentUser('id') id: string, @Body() dto: UserDto) {
		return this.userService.update(id, dto)
	}
}
