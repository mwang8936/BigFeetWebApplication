import { FC } from 'react';

import FilterPayrolls from './FilterPayrolls.Component';

import BaseModal from '../BaseModal.Component';

interface FilterPayrollsModalProp {
	open: boolean;
	setOpen(open: boolean): void;
}

const FilterPayrollsModal: FC<FilterPayrollsModalProp> = ({
	open,
	setOpen,
}) => {
	return (
		<BaseModal
			open={open}
			setOpen={setOpen}
			contentElement={<FilterPayrolls setOpen={setOpen} />}
		/>
	);
};

export default FilterPayrollsModal;
