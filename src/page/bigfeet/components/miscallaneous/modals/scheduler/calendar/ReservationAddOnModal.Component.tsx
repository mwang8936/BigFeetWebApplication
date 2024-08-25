import { FC } from 'react';

import ReservationAddOn from './ReservationAddOn.Component';

import BaseModal from '../../BaseModal.Component';

import Reservation from '../../../../../../../models/Reservation.Model';

interface ReservationAddOnModalProp {
	open: boolean;
	setOpen(open: boolean): void;
	reservation: Reservation;
}

const ReservationAddOnModal: FC<ReservationAddOnModalProp> = ({
	open,
	setOpen,
	reservation,
}) => {
	return (
		<BaseModal
			open={open}
			setOpen={setOpen}
			contentElement={
				<ReservationAddOn setOpen={setOpen} reservation={reservation} />
			}
		/>
	);
};

export default ReservationAddOnModal;
