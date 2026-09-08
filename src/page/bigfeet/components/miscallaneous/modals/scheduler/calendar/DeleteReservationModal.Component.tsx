import { FC } from 'react';

import DeleteReservation from './DeleteReservation.Component';

import BaseModal from '../../BaseModal.Component';

interface DeleteReservationModalProp {
	open: boolean;
	setOpen(open: boolean): void;
	reservationId: number;
	reservedDate: Date;
}

const DeleteReservationModal: FC<DeleteReservationModalProp> = ({
	open,
	setOpen,
	reservationId,
	reservedDate,
}) => {
	return (
		<BaseModal
			open={open}
			setOpen={setOpen}
			contentElement={
				<DeleteReservation
					setOpen={setOpen}
					reservationId={reservationId}
					reservedDate={reservedDate}
				/>
			}
		/>
	);
};

export default DeleteReservationModal;
