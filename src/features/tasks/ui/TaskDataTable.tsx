import { Table, TableBody, TableCell, TableHead, TableRow } from '@/components/ui/table'
import { IDataTable } from '../types/dataTable'
import { Button } from '@/components/ui/button'
import { Popover } from '@/components/ui/popover'
import { ButtonGroup } from '@/components/ui/button-group'

type TaskDataTableProps = {
	data: IDataTable[]
}

export default function TaskDataTable({ data }: TaskDataTableProps) {
	return (
		<Table>
			<TableRow>
				<TableHead className='w-50'>Status</TableHead>
				<TableHead className='w-50'>User</TableHead>
				<TableHead className='w-50'>Data</TableHead>
				<TableHead className='w-50'>Action</TableHead>
			</TableRow>
			<TableBody>
				{!data ? (
					<TableRow>
						<TableCell colSpan={3}>No data</TableCell>
					</TableRow>
				) : (
					data.map(_ => (
						<TableRow key={_.id}>
							<TableCell>{_.status}</TableCell>
							<TableCell>{_.user}</TableCell>
							<TableCell>{_.date}</TableCell>
							<TableCell>
								<Popover>
									<ButtonGroup>
										<Button>Edit</Button>
										<Button>Delete</Button>
									</ButtonGroup>
								</Popover>
							</TableCell>
						</TableRow>
					))
				)}
			</TableBody>
		</Table>
	)
}
