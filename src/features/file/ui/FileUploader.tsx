'use client'

import {
	Attachment,
	AttachmentAction,
	AttachmentActions,
	AttachmentContent,
	AttachmentMedia,
	AttachmentTitle,
} from '@/components/ui/attachment'
import { Button } from '@/components/ui/button'
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@/components/ui/empty'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Cloud, FileCodeIcon, XIcon } from 'lucide-react'
import { useState } from 'react'

type FileUploaderProps = {
	onFileSelect: (file: File | null) => void
	onFileRemove?: () => void
	value?: File | null
	accept?: string
	attachmentName?: string
}

export default function FileUploader({
	onFileSelect,
	onFileRemove,
	value,
	accept = '.zip',
	attachmentName,
}: FileUploaderProps) {
	const [file, setFile] = useState<File | null>(value || null)

	/* const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = e.target.files?.[0] || null
		setFile(selectedFile)
		onFileSelect(selectedFile)
		//------------------------Text------------------------//
	} */

	const handleRemove = () => {
		setFile(null)
		onFileSelect(null)
		onFileRemove?.()
	}

	return (
		<>
			<Empty className='border border-dashed'>
				<EmptyHeader>
					<EmptyMedia variant='icon'>
						<Cloud />
					</EmptyMedia>
					<EmptyTitle>Добавить архив</EmptyTitle>
					<EmptyDescription>
						Upload zip-file
						<br />
						(optional)
					</EmptyDescription>
				</EmptyHeader>
				<EmptyContent>
					<Field>
						<FieldLabel>Upload zip-file</FieldLabel>
						<Input type='file' accept={accept} />
					</Field>
				</EmptyContent>
			</Empty>
			{attachmentName && (
				<Attachment className='w-full'>
					<AttachmentMedia>
						<FileCodeIcon />
					</AttachmentMedia>
					<AttachmentContent>
						<AttachmentTitle>{attachmentName}</AttachmentTitle>
					</AttachmentContent>
					<AttachmentAction>
						<AttachmentAction aria-label='Remove zip-file' onChange={() => handleRemove}>
							<XIcon />
						</AttachmentAction>
					</AttachmentAction>
				</Attachment>
			)}
		</>
	)
}
