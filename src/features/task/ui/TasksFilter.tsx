import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'

const items = [
	{ label: 'Компании', value: null },
	{ label: 'Apple', value: 'apple' },
	{ label: 'Banana', value: 'banana' },
	{ label: 'Blueberry', value: 'blueberry' },
	{ label: 'Grapes', value: 'grapes' },
	{ label: 'Pineapple', value: 'pineapple' },
]

export default function TasksFilter() {
	return (
		<Card>
			<CardHeader></CardHeader>
			<CardContent>
				<Select items={items}>
					<SelectTrigger className='w-full'>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							{items.map(item => (
								<FieldGroup key={item.label}>
									<Field orientation={'horizontal'}>
										<Checkbox id='checkbox-companyname' />
										<FieldLabel id='checkbox-companyname'>SpaceX</FieldLabel>
									</Field>
								</FieldGroup>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>
				<Select items={items}>
					<SelectTrigger className='w-full'>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<RadioGroup>
								{items.map((item, index) => (
									<div key={item.label} className='flex gap-3 items-center'>
										<RadioGroupItem value='default' id={index.toString()} />
										<Label htmlFor={index.toString()}>{item.value}</Label>
									</div>
								))}
							</RadioGroup>
						</SelectGroup>
					</SelectContent>
				</Select>
				<Select items={items}>
					<SelectTrigger className='w-full'>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<RadioGroup>
								{items.map((item, index) => (
									<div key={item.label} className='flex gap-3 items-center'>
										<RadioGroupItem value='default' id={index.toString()} />
										<Label htmlFor={index.toString()}>{item.value}</Label>
									</div>
								))}
							</RadioGroup>
						</SelectGroup>
					</SelectContent>
				</Select>
				<Select items={items}>
					<SelectTrigger className='w-full'>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							{items.map(item => (
								<FieldGroup key={item.label}>
									<Field orientation={'horizontal'}>
										<Checkbox id='checkbox-tag' />
										<FieldLabel id='checkbox-tag'>SpaceX</FieldLabel>
									</Field>
								</FieldGroup>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>
			</CardContent>
			<CardFooter>
				<Button className='flex-1'>Сбросить фильтры</Button>
			</CardFooter>
		</Card>
	)
}
