import { FC } from 'react';

import FilterServices from './FilterServices.Component';

import BaseModal from '../BaseModal.Component';

interface FilterServicesModalProp {
	open: boolean;
	setOpen(open: boolean): void;
}

const FilterServicesModal: FC<FilterServicesModalProp> = ({
	open,
	setOpen,
}) => {
	return (
		<BaseModal
			open={open}
			setOpen={setOpen}
			contentElement={<FilterServices setOpen={setOpen} />}
		/>
	);
};

export default FilterServicesModal;
