import { ArrowBigLeft } from 'lucide-react'
import Link from 'next/link'

const NotFound = () => {
	return (
		<>
			<article className='w-full min-[768px]:h-[1000px] flex justify-center items-center'>
				<div className='rounded-[35px] border-6 border-orange-300 px-30 py-20 bg-amber-500/40 flex flex-col justify-between h-[400px] min-h-[300px] relative'>
					<div className='absolute left-4 top-[70%]'></div>
					<p className='opacity-65 text-[70px] font-bold'>Страница не найдена</p>
					<div className='flex items-center'>
						<ArrowBigLeft size={30} />
						<Link className='text-2xl font-semibold text-black/60' href='/'>
							Вернуться на главную
						</Link>
					</div>
				</div>
			</article>
		</>
	)
}

export default NotFound
