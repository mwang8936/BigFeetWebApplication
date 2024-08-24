import { FC } from 'react';

import EditReservation from './EditReservation.Component';

import BaseModal from '../../BaseModal.Component';

import Reservation from '../../../../../../../models/Reservation.Model';

interface EditReservationModalProp {
	open: boolean;
	setOpen(open: boolean): void;
	reservation: Reservation;
}

const EditReservationModal: FC<EditReservationModalProp> = ({
	open,
	setOpen,
	reservation,
}) => {
	return (
		<BaseModal
			open={open}
			setOpen={setOpen}
			contentElement={
				<EditReservation setOpen={setOpen} reservation={reservation} />
			}
		/>
	);
};

export default EditReservationModal;
