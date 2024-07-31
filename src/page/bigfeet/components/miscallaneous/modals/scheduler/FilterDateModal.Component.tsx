import { FC } from 'react';

import FilterDate from './FilterDate.Component';

import BaseModal from '../BaseModal.Component';

interface FilterDateModalProp {
	open: boolean;
	setOpen(open: boolean): void;
	date: Date;
	onDateSelected(date: Date): void;
	editable: boolean;
	selectPast: boolean;
	selectFuture: boolean;
}

const FilterDateModal: FC<FilterDateModalProp> = ({
	open,
	setOpen,
	date,
	onDateSelected,
	editable,
	selectPast,
	selectFuture,
}) => {
	return (
		<BaseModal
			open={open}
			setOpen={setOpen}
			contentElement={
				<FilterDate
					setOpen={setOpen}
					date={date}
					onDateSelected={onDateSelected}
					editable={editable}
					selectPast={selectPast}
					selectFuture={selectFuture}
				/>
			}
		/>
	);
};

export default FilterDateModal;
