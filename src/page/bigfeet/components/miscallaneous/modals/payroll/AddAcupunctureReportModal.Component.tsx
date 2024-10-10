import { FC } from 'react';

import AddAcupunctureReport from './AddAcupunctureReport.Component';

import BaseModal from '../BaseModal.Component';

import Employee from '../../../../../../models/Employee.Model';

interface AddAcupunctureReportModalProp {
	open: boolean;
	setOpen(open: boolean): void;
	employee: Employee;
}

const AddAcupunctureReportModal: FC<AddAcupunctureReportModalProp> = ({
	open,
	setOpen,
	employee,
}) => {
	return (
		<BaseModal
			open={open}
			setOpen={setOpen}
			contentElement={
				<AddAcupunctureReport setOpen={setOpen} employee={employee} />
			}
		/>
	);
};

export default AddAcupunctureReportModal;
