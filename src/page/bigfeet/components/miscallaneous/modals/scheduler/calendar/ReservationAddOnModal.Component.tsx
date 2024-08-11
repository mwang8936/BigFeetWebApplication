import { FC } from 'react';

import ReservationAddOn from './ReservationAddOn.Component';

import BaseModal from '../../BaseModal.Component';

import Reservation from '../../../../../../../models/Reservation.Model';

import { AddReservationRequest } from '../../../../../../../models/requests/Reservation.Request.Model';

interface ReservationAddOnModalProp {
	open: boolean;
	setOpen(open: boolean): void;
	reservation: Reservation;
	onAddReservation(request: AddReservationRequest): Promise<void>;
}

const ReservationAddOnModal: FC<ReservationAddOnModalProp> = ({
	open,
	setOpen,
	reservation,
	onAddReservation,
}) => {
	return (
		<BaseModal
			open={open}
			setOpen={setOpen}
			contentElement={
				<ReservationAddOn
					setOpen={setOpen}
					reservation={reservation}
					onAddReservation={onAddReservation}
				/>
			}
		/>
	);
};

export default ReservationAddOnModal;
