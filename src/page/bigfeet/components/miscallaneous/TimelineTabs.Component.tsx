import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { BsXCircleFill } from 'react-icons/bs';
import { HiCalendar, HiLocationMarker } from 'react-icons/hi';

import { Timeline, Tooltip } from 'flowbite-react';

import { useUserQuery } from '../../../hooks/profile.hooks';

import { Language } from '../../../../models/enums';
import User from '../../../../models/User.Model';

import { sameDate } from '../../../../utils/date.utils';

interface TimelineTabsProp {
	dates: Date[];
	date: Date;
	setDate(date: Date): void;
	tips?: string[][];
	discontinuedDate?: Date;
}

const TimelineTabs: FC<TimelineTabsProp> = ({
	dates,
	date,
	setDate,
	tips,
	discontinuedDate,
}) => {
	const { t } = useTranslation();

	const userQuery = useUserQuery({ gettable: true, staleTime: Infinity });
	const user: User = userQuery.data;

	const language = user.language;

	let localeDateFormat: string | undefined;
	if (language === Language.SIMPLIFIED_CHINESE) {
		localeDateFormat = 'zh-CN';
	} else if (language === Language.TRADITIONAL_CHINESE) {
		localeDateFormat = 'zh-TW';
	} else {
		localeDateFormat = undefined;
	}

	const currentDate = new Date();
	const isCurrentDate = sameDate(currentDate, date);

	const isDiscontinuedDate = discontinuedDate
		? sameDate(discontinuedDate, date)
		: false;

	const tabs = dates.map((date) =>
		date.toLocaleDateString(localeDateFormat, {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		})
	);

	const selectedDateAfterDiscontinuedDate = discontinuedDate
		? date >= discontinuedDate
		: false;

	const currentDateAfterDiscontinuedDate = discontinuedDate
		? currentDate >= discontinuedDate
		: false;

	const selectedTab =
		dates.length -
		1 -
		[...dates].reverse().findIndex((tabDate) => date >= tabDate);

	const timelineTab = (
		tab: string,
		tabDate: Date,
		blue: boolean = false,
		tipContent?: JSX.Element | string
	) => {
		const isTabDate = sameDate(tabDate, date);

		const isCurrentlyTabDate = sameDate(tabDate, currentDate);

		const tabString = isCurrentlyTabDate ? `${t('Now')} - ${tab}` : tab;

		const timelineItem = (
			<Timeline.Item
				className={`border-t-4 ${blue && 'border-blue-500'} ${
					!isTabDate && 'cursor-pointer'
				}`}
				onClick={() => setDate(tabDate)}
			>
				<Timeline.Point
					icon={HiCalendar}
					theme={{
						marker: {
							base: {
								horizontal:
									'absolute -left-1.5 h-3 w-3 rounded-full border border-white bg-gray-200 dark:border-gray-900 dark:bg-gray-700',
								vertical:
									'absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-gray-200 dark:border-gray-900 dark:bg-gray-700',
							},
							icon: {
								base: `${
									isTabDate ? 'h-5 w-5' : 'h-3 w-3'
								} text-cyan-600 dark:text-cyan-300 ${
									blue && 'text-blue-600 dark:text-blue-300'
								}`,
								wrapper: `absolute -left-3 flex ${
									isTabDate ? 'h-8 w-8' : 'h-6 w-6'
								} items-center justify-center rounded-full bg-cyan-200 dark:bg-cyan-900 ${
									blue && 'bg-blue-200 dark:bg-blue-900'
								} ring-8 ring-white dark:ring-gray-900`,
							},
						},
					}}
				/>

				<Timeline.Content className="pt-2 pr-20">
					<Timeline.Time className={blue ? 'text-blue-500' : undefined}>
						{tabString}
					</Timeline.Time>
				</Timeline.Content>
			</Timeline.Item>
		);

		return tipContent ? (
			<Tooltip
				content={tipContent}
				placement="top-start"
				theme={{
					arrow: {
						base: 'absolute z-10 h-2 w-2 rotate-45',
						placement: '-4px',
					},
				}}
				className={`bg-black px-2 ${blue ? 'text-blue-300' : 'text-white'}`}
			>
				{timelineItem}
			</Tooltip>
		) : (
			timelineItem
		);
	};

	const nowTab = (
		end: boolean = false,
		red: boolean = false,
		blue: boolean = false
	) => {
		return (
			<Timeline.Item
				className={`border-t-4 ${blue && 'border-blue-500'} ${
					red && 'border-red-500'
				} ${!isCurrentDate && 'cursor-pointer'}`}
				onClick={() => setDate(currentDate)}
			>
				<Timeline.Point
					icon={HiLocationMarker}
					className={end ? 'absolute right-2' : undefined}
					theme={{
						marker: {
							base: {
								horizontal:
									'absolute -left-1.5 h-3 w-3 rounded-full border border-white bg-gray-200 dark:border-gray-900 dark:bg-gray-700',
								vertical:
									'absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-gray-200 dark:border-gray-900 dark:bg-gray-700',
							},
							icon: {
								base: `${
									isCurrentDate ? 'h-5 w-5' : 'h-3 w-3'
								} text-cyan-600 dark:text-cyan-300 ${
									blue && 'text-blue-600 dark:text-blue-300'
								} ${red && 'text-red-600 dark:text-red-300'}`,
								wrapper: `absolute -left-3 flex ${
									isCurrentDate ? 'h-8 w-8' : 'h-6 w-6'
								} items-center justify-center rounded-full bg-cyan-200 dark:bg-cyan-900 ${
									blue && 'bg-blue-200 dark:bg-blue-900'
								} ${
									red && 'bg-red-200 dark:bg-red-900'
								} ring-8 ring-white dark:ring-gray-900`,
							},
						},
					}}
				/>

				<Timeline.Content className={`pt-2 ${!end ? 'pr-20' : undefined}`}>
					<Timeline.Time className={blue ? 'text-blue-500' : undefined}>
						{t('Now')}
					</Timeline.Time>
				</Timeline.Content>
			</Timeline.Item>
		);
	};

	const discontinuedTab = (end: boolean = false) => {
		if (discontinuedDate) {
			const discontinuedTabString = discontinuedDate.toLocaleDateString(
				localeDateFormat,
				{
					year: 'numeric',
					month: 'short',
					day: 'numeric',
				}
			);

			const tabString = sameDate(discontinuedDate, currentDate)
				? `${t('Now')} - ${discontinuedTabString}`
				: discontinuedTabString;

			return (
				<Tooltip
					content={t('Discontinued')}
					placement="top-start"
					theme={{
						arrow: {
							base: 'absolute z-10 h-2 w-2 rotate-45',
							placement: '-4px',
						},
					}}
					className={`bg-black px-2 text-red-500`}
				>
					<Timeline.Item
						className={`border-t-4 border-red-500 ${
							!isDiscontinuedDate && 'cursor-pointer'
						}`}
						onClick={() => setDate(discontinuedDate)}
					>
						<Timeline.Point
							icon={BsXCircleFill}
							className={end ? 'absolute right-2' : undefined}
							theme={{
								marker: {
									base: {
										horizontal:
											'absolute -left-1.5 h-3 w-3 rounded-full border border-white bg-gray-200 dark:border-gray-900 dark:bg-gray-700',
										vertical:
											'absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-gray-200 dark:border-gray-900 dark:bg-gray-700',
									},
									icon: {
										base: `${
											isDiscontinuedDate ? 'h-5 w-5' : 'h-3 w-3'
										} text-red-600 dark:text-red-300`,
										wrapper: `absolute -left-3 flex ${
											isDiscontinuedDate ? 'h-8 w-8' : 'h-6 w-6'
										} items-center justify-center rounded-full bg-red-200 ring-8 ring-white dark:bg-red-900 dark:ring-gray-900`,
									},
								},
							}}
						/>

						<Timeline.Content className={`pt-2 ${!end ? 'pr-20' : undefined}`}>
							<Timeline.Time className="text-red-500">
								{tabString}
							</Timeline.Time>
						</Timeline.Content>
					</Timeline.Item>
				</Tooltip>
			);
		} else {
			return <></>;
		}
	};

	return (
		<Timeline horizontal className="overflow-x-auto pt-8 pb-2 px-6">
			{tabs.map((tab, index) => {
				const selected = selectedTab === index;

				const tabDate = dates[index];

				let tipContent: JSX.Element | undefined = undefined;
				if (tips && index < tips.length) {
					const changes = tips[index];

					if (changes.length > 0) {
						tipContent = (
							<div className="flex flex-col">
								{changes.map((change) => (
									<span>{change}</span>
								))}
							</div>
						);
					}
				}

				const tabElement = timelineTab(
					tab,
					tabDate,
					selected && !selectedDateAfterDiscontinuedDate,
					tipContent
				);

				const isLastTab = index === tabs.length - 1;

				const showNowElement =
					tabDate <= currentDate &&
					(isLastTab || dates[index + 1] > currentDate);

				const showDiscontinuedElement = discontinuedDate && isLastTab;

				if (!showNowElement && !showDiscontinuedElement) {
					return tabElement;
				}

				if (showNowElement && !showDiscontinuedElement) {
					const nowElement = nowTab(isLastTab, false, selected);

					if (sameDate(currentDate, tabDate)) {
						return <>{tabElement}</>;
					} else {
						return (
							<>
								{tabElement}
								{nowElement}
							</>
						);
					}
				}

				if (!showNowElement && showDiscontinuedElement) {
					const discontinuedElement = discontinuedTab(true);

					return (
						<>
							{tabElement}
							{discontinuedElement}
						</>
					);
				}

				if (showNowElement && showDiscontinuedElement) {
					if (sameDate(discontinuedDate, currentDate)) {
						const discontinuedElement = discontinuedTab(true);

						return (
							<>
								{tabElement}
								{discontinuedElement}
							</>
						);
					}

					if (currentDateAfterDiscontinuedDate) {
						const discontinuedElement = discontinuedTab();
						const nowElement = nowTab(true, true);

						return (
							<>
								{tabElement}
								{discontinuedElement}
								{nowElement}
							</>
						);
					} else {
						const nowElement = nowTab(false, false, selected);
						const discontinuedElement = discontinuedTab(true);

						if (sameDate(currentDate, tabDate)) {
							return (
								<>
									{tabElement}
									{discontinuedElement}
								</>
							);
						} else {
							return (
								<>
									{tabElement}
									{nowElement}
									{discontinuedElement}
								</>
							);
						}
					}
				}
			})}
		</Timeline>
	);
};

export default TimelineTabs;
