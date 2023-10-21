import { useEffect, useRef } from 'react';

interface CalendarFixedColumnProp {
	timeArr: string[];
}

export default function CalendarFixedColumn(prop: CalendarFixedColumnProp) {
	const currentTimeRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		currentTimeRef?.current?.scrollIntoView({
			block: 'start',
			inline: 'start',
			behavior: 'smooth',
		});
	}, []);

	const currentDate = new Date();

	const scrollable = (minuteIsZero: boolean, hour: number) => {
		return (
			currentDate.getHours() == hour &&
			((currentDate.getMinutes() < 30 && minuteIsZero) ||
				(currentDate.getMinutes() >= 30 && !minuteIsZero))
		);
	};

	return (
		<>
			<div className='row-start-[1] col-start-[1] sticky top-0 left-0 z-10 bg-white border-slate-100 bg-clip-padding text-slate-900 border-b text-sm font-medium py-2'></div>
			{prop.timeArr.map((time, index) =>
				scrollable(
					parseInt(time.split(':')[1]) == 0,
					parseInt(time.split(':')[0]) +
						(time.includes('PM') ? 12 : 0)
				) ? (
					<div
						key={`row-1 col-${index + 2}`}
						ref={currentTimeRef}
						style={{ gridRowStart: index + 2 }}
						className='col-start-[1] border-slate-300 border-r text-xs p-1.5 text-right text-slate-400 uppercase sticky left-0 bg-white font-medium scroll-mt-10'
					>
						{time}
					</div>
				) : (
					<div
						key={`row-1 col-${index + 2}`}
						style={{ gridRowStart: index + 2 }}
						className='col-start-[1] border-slate-300 border-r text-xs p-1.5 text-right text-slate-400 uppercase sticky left-0 bg-white font-medium'
					>
						{time}
					</div>
				)
			)}
		</>
	);
}
