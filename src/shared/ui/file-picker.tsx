'use client'

import { useId, useRef } from 'react'
import { CloudUpload, FileArchive, XIcon } from 'lucide-react'
import {
	Attachment,
	AttachmentAction,
	AttachmentActions,
	AttachmentContent,
	AttachmentDescription,
	AttachmentMedia,
	AttachmentTitle,
} from './attachment'
import { Button } from './button'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from './empty'

type FilePickerProps = {
	value: File | null
	onChange: (file: File | null) => void
	accept?: string
	title: string
	description?: string
	chooseLabel: string
	removeLabel: string
	invalid?: boolean
}

const formatSize = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1)} MB`

/** Управляемый выбор одного файла: значение хранит форма (react-hook-form), а не компонент. */
export function FilePicker({
	value,
	onChange,
	accept,
	title,
	description,
	chooseLabel,
	removeLabel,
	invalid,
}: FilePickerProps) {
	const inputId = useId()
	const inputRef = useRef<HTMLInputElement>(null)

	const handleRemove = () => {
		onChange(null)
		if (inputRef.current) inputRef.current.value = ''
	}

	if (value) {
		return (
			<Attachment className='w-full' data-state={invalid ? 'error' : undefined}>
				<AttachmentMedia>
					<FileArchive />
				</AttachmentMedia>
				<AttachmentContent>
					<AttachmentTitle>{value.name}</AttachmentTitle>
					<AttachmentDescription>{formatSize(value.size)}</AttachmentDescription>
				</AttachmentContent>
				<AttachmentActions>
					<AttachmentAction type='button' aria-label={removeLabel} onClick={handleRemove}>
						<XIcon />
					</AttachmentAction>
				</AttachmentActions>
			</Attachment>
		)
	}

	return (
		<Empty className='border border-dashed'>
			<EmptyHeader>
				<EmptyMedia variant='icon'>
					<CloudUpload />
				</EmptyMedia>
				<EmptyTitle>{title}</EmptyTitle>
				{description && <EmptyDescription>{description}</EmptyDescription>}
			</EmptyHeader>
			<EmptyContent>
				<input
					ref={inputRef}
					id={inputId}
					type='file'
					accept={accept}
					className='sr-only'
					aria-invalid={invalid}
					onChange={event => onChange(event.target.files?.[0] ?? null)}
				/>
				<Button type='button' variant='outline' onClick={() => inputRef.current?.click()}>
					{chooseLabel}
				</Button>
			</EmptyContent>
		</Empty>
	)
}
