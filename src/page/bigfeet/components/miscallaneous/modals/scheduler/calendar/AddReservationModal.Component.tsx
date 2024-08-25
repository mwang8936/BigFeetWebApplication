import { FC } from 'react';

import AddReservation from './AddReservation.Component';

import BaseModal from '../../BaseModal.Component';

interface AddReservationModalProp {
	open: boolean;
	setOpen(open: boolean): void;
	defaultDate?: Date;
	defaultEmployeeId?: number;
}

const AddReservationModal: FC<AddReservationModalProp> = ({
	open,
	setOpen,
	defaultDate,
	defaultEmployeeId,
}) => {
	return (
		<BaseModal
			open={open}
			setOpen={setOpen}
			contentElement={
				<AddReservation
					setOpen={setOpen}
					defaultDate={defaultDate}
					defaultEmployeeId={defaultEmployeeId}
				/>
			}
		/>
	);
};

export default AddReservationModal;
