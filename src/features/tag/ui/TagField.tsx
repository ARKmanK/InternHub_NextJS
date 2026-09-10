'use client'

import { Field } from '@/components/ui/field'
import { useActions } from '@/shared/model/useActions'
import TagCreationForm from './TagCreationForm'
import { useTagsSummary } from '@/app/(store)/hooks/useTagsSummary'
import { Item, ItemContent, ItemHeader } from '@/components/ui/item'
import Tag from '@/shared/ui/Tag'
import { Button } from '@/components/ui/button'
import { XIcon } from 'lucide-react'
import { useEffect } from 'react'

type TagFieldProps = {
	value?: string
	onChange?: (tags: string[]) => void
}

export default function TagField({ onChange }: TagFieldProps) {
	const { removeUserTag } = useActions()
	const { defaultTags, userTags } = useTagsSummary()

	useEffect(() => {
		if (onChange) {
			const tagLabels = userTags.map(tag => tag.label)
			onChange(tagLabels as any)
		}
	}, [userTags, onChange])

	return (
		<Field orientation={'vertical'}>
			<Item>
				<ItemHeader>Main tags</ItemHeader>
				<ItemContent className='flex'>
					{defaultTags.map(tag => (
						<Tag key={tag.id} tagName={tag.label} />
					))}
					{userTags.map(tag => (
						<div className='flex'>
							<Tag key={tag.id} tagName={tag.label} />
							<Button onClick={() => removeUserTag(tag.id)}>
								<XIcon color='red' />
							</Button>
						</div>
					))}
				</ItemContent>
			</Item>
			<TagCreationForm />
		</Field>
	)
}
