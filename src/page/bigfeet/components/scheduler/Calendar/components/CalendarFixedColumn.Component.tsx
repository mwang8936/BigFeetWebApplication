import { useEffect, useRef } from 'react';
import { scrollable } from '../../../../../../utils/calendar.utils';
import { useTranslation } from 'react-i18next';

interface CalendarFixedColumnProp {
	timeArr: string[];
}

export default function CalendarFixedColumn(prop: CalendarFixedColumnProp) {
	const { t } = useTranslation();
	const currentTimeRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		currentTimeRef?.current?.scrollIntoView({
			block: 'start',
			inline: 'start',
			behavior: 'smooth',
		});
	}, []);

	const getTimeDiv = (time: string, index: number) => {
		const isScrollable = scrollable(time);
		return (
			<div
				key={`row-1 col-${index + 2}`}
				ref={isScrollable ? currentTimeRef : null}
				style={{ gridRowStart: index + 2 }}
				className={`col-start-[1] border-slate-300 border-r whitespace-nowrap p-1.5 text-right text-black uppercase sticky left-0 z-[5] bg-white font-medium ${
					isScrollable ? 'scroll-mt-10' : ''
				}`}>
				{time}
			</div>
		);
	};

	return (
		<>
			<div className="row-start-[1] col-start-[1] sticky top-0 left-0 z-[10] bg-white border-slate-100 bg-clip-padding text-slate-900 border-b text-sm font-medium py-2" />
			{prop.timeArr.map((time, index) => getTimeDiv(time, index))}
			<div
				style={{ gridRowStart: prop.timeArr.length + 2 }}
				className="col-start-[1] border-slate-300 border-r whitespace-nowrap p-1.5 text-right text-black uppercase sticky left-0 z-[5] bg-white font-medium">
				{t('Total')}
			</div>
			<div
				style={{ gridRowStart: prop.timeArr.length + 3 }}
				className="col-start-[1] border-slate-300 border-r whitespace-nowrap p-1.5 text-right text-black uppercase sticky left-0 z-[5] bg-white font-medium">
				{t('Tips')}
			</div>
			<div
				style={{ gridRowStart: prop.timeArr.length + 4 }}
				className="col-start-[1] border-slate-300 border-r whitespace-nowrap p-1.5 text-right text-black uppercase sticky left-0 z-[5] bg-white font-medium">
				{t('VIP')}
			</div>
			<div
				style={{ gridRowStart: prop.timeArr.length + 5 }}
				className="col-start-[1] border-slate-300 border-r whitespace-nowrap p-1.5 text-right text-black uppercase sticky left-0 z-[5] bg-white font-medium">
				{t('Payout')}
			</div>
			<div
				style={{ gridRowStart: prop.timeArr.length + 6 }}
				className="col-start-[1] border-slate-300 border-r whitespace-nowrap p-1.5 text-right text-black uppercase sticky left-0 z-[5] bg-white font-medium">
				{t('Sign Off')}
			</div>
		</>
	);
}
