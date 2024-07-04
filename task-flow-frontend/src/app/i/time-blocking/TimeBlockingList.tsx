import { DndContext, closestCenter } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

import Loader from '@/components/ui/Loader'

import { TimeBlock } from './TimeBlock'
import styles from './TimeBlock.module.scss'
import { calcHoursLeft } from './calc-hours-left'
import { useTimeBlockDnd } from './hooks/useTimeBlockDnd'
import { useTimeBlocks } from './hooks/useTimeBlocks'

export function TimeBlockingList() {
	const { items, setItems, isLoading } = useTimeBlocks()
	const { handleDragEnd, sensors } = useTimeBlockDnd(items, setItems)

	if (isLoading) return <Loader />

	const { hoursLeft } = calcHoursLeft(items)

	function getHourEnding(hours: number): string {
		if (hours === 11 || hours === 12 || hours === 13 || hours === 14) {
			return 'часов'
		}

		const lastDigit = hours % 10

		if (lastDigit === 1) {
			return 'час'
		} else if (lastDigit >= 2 && lastDigit <= 4) {
			return 'часа'
		} else {
			return 'часов'
		}
	}

	return (
		<div>
			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragEnd={handleDragEnd}
			>
				<div className={styles.list}>
					<SortableContext
						items={items || []}
						strategy={verticalListSortingStrategy}
					>
						{items?.length ? (
							items?.map(item => (
								<TimeBlock
									key={item.id}
									item={item}
								/>
							))
						) : (
							<div>Add first</div>
						)}
					</SortableContext>
				</div>
			</DndContext>
			<div>
				{hoursLeft > 0
					? `${hoursLeft} ${getHourEnding(hoursLeft)} ты сможешь поспать с:`
					: 'Для сна не осталось времени :с'}
			</div>
		</div>
	)
}
