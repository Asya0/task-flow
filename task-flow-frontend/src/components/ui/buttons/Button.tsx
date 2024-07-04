import classNames from 'clsx'
import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'

type TypeButton = ButtonHTMLAttributes<HTMLButtonElement>

export function Button({
	children,
	className,
	...rest
}: PropsWithChildren<TypeButton>) {
	return (
		<button
			className={classNames(
				'linear rounded-lg bg-transparent border border-blue py-2 px-7 m-2 text-base font-medium text-white transition hover:bg-blue active:bg-brand-700',
				className
			)}
			{...rest}
		>
			{children}
		</button>
	)
}
