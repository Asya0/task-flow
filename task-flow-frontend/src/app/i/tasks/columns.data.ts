//dayjs -- потому что самая легковесная библиотека которая существует
import dayjs, { type Dayjs } from 'dayjs'
import 'dayjs/locale/ru'
import isoWeek from 'dayjs/plugin/isoWeek'
import weekOfYear from 'dayjs/plugin/weekOfYear'

dayjs.extend(weekOfYear)
dayjs.extend(isoWeek)

export const FILTERS: Record<string, Dayjs> = {
	today: dayjs().startOf('day'),
	tomorrow: dayjs().add(1, 'day').startOf('day'), //сегодняшний день + 1 день
	'on-this-week': dayjs().endOf('isoWeek'),
	'on-next-week': dayjs().add(1, 'week').startOf('day'),
	later: dayjs().add(2, 'week').startOf('day') //later означает +2 недели
}

export const COLUMNS = [
	{
		label: 'Сегодня',
		value: 'today'
	},
	{
		label: 'Завтра',
		value: 'tomorrow'
	},
	{
		label: 'На этой неделе',
		value: 'on-this-week'
	},
	{
		label: 'На следующей неделе',
		value: 'on-next-week'
	},
	{
		label: 'Когда-нибудь',
		value: 'later'
	},
	{
		label: 'Выполнено',
		value: 'completed'
	}
]
