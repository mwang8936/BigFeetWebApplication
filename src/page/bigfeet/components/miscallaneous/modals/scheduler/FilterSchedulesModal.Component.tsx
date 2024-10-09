import { FC } from 'react';

import FilterSchedules from './FilterSchedules.Component';

import BaseModal from '../BaseModal.Component';

interface FilterSchedulesModalProp {
	open: boolean;
	setOpen(open: boolean): void;
}

const FilterSchedulesModal: FC<FilterSchedulesModalProp> = ({
	open,
	setOpen,
}) => {
	return (
		<BaseModal
			open={open}
			setOpen={setOpen}
			contentElement={<FilterSchedules setOpen={setOpen} />}
		/>
	);
};

export default FilterSchedulesModal;
