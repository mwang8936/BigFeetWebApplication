import { FC } from 'react';

import DeleteReservation from './DeleteReservation.Component';

import BaseModal from '../../BaseModal.Component';

interface DeleteReservationModalProp {
	open: boolean;
	setOpen(open: boolean): void;
	reservationId: number;
}

const DeleteReservationModal: FC<DeleteReservationModalProp> = ({
	open,
	setOpen,
	reservationId,
}) => {
	return (
		<BaseModal
			open={open}
			setOpen={setOpen}
			contentElement={
				<DeleteReservation setOpen={setOpen} reservationId={reservationId} />
			}
		/>
	);
};

export default DeleteReservationModal;
