//hook будет брать профайл и из него брать некоторые значения
import { useProfile } from '@/hooks/useProfile'

export function useLoadSettings() {
	const { data } = useProfile()

	const workInterval = data?.user.workInterval ?? 50
	const breakInterval = data?.user.breakInterval ?? 10
	const intervalsCount = data?.user.intervalsCount ?? 7
	return { workInterval, breakInterval, intervalsCount }
}
