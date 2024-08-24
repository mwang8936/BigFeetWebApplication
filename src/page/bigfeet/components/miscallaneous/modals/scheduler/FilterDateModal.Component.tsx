import { FC } from 'react';

import FilterDate from './FilterDate.Component';

import BaseModal from '../BaseModal.Component';

interface FilterDateModalProp {
	open: boolean;
	setOpen(open: boolean): void;
}

const FilterDateModal: FC<FilterDateModalProp> = ({ open, setOpen }) => {
	return (
		<BaseModal
			open={open}
			setOpen={setOpen}
			contentElement={<FilterDate setOpen={setOpen} />}
		/>
	);
};

export default FilterDateModal;
