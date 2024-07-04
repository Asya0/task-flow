import { IsOptional, IsString, IsNumber } from 'class-validator'

export class TimeBlockDto {
	@IsString()
	name: string

	@IsString()
	@IsOptional()
	color?: string

	//длительность
	@IsNumber()
	duration: number

	//порядок в очереди
	@IsOptional()
	@IsNumber()
	order: number
}
