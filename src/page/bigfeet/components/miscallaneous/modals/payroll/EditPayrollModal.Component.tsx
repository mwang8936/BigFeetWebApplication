import { FC } from 'react';

import EditPayroll from './EditPayroll.Component';

import BaseModal from '../BaseModal.Component';

import Payroll from '../../../../../../models/Payroll.Model';

interface EditPayrollModalProp {
	open: boolean;
	setOpen(open: boolean): void;
	payroll: Payroll;
}

const EditPayrollModal: FC<EditPayrollModalProp> = ({
	open,
	setOpen,
	payroll,
}) => {
	return (
		<BaseModal
			open={open}
			setOpen={setOpen}
			contentElement={<EditPayroll setOpen={setOpen} payroll={payroll} />}
		/>
	);
};

export default EditPayrollModal;
