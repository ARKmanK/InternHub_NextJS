'use client'

import { useTranslations } from 'next-intl'
import type { FieldError as HookFormFieldError } from 'react-hook-form'
import type { ValidationKey } from '@/shared/i18n'
import { FieldError } from './field'

type FormFieldErrorProps = {
	error?: HookFormFieldError
}

/** FieldError из shadcn, который переводит ключ ошибки из zod-схемы (см. validation.translations.ts). */
export function FormFieldError({ error }: FormFieldErrorProps) {
	const t = useTranslations('Validation')

	if (!error?.message) return null

	return <FieldError>{t(error.message as ValidationKey)}</FieldError>
}
