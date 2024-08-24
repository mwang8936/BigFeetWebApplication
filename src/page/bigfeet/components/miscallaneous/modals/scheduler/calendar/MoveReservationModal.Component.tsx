import { FC } from 'react';

import MoveReservation from './MoveReservation.Component';

import BaseModal from '../../BaseModal.Component';

import Reservation from '../../../../../../../models/Reservation.Model';

interface MoveReservationModalProp {
	open: boolean;
	setOpen(open: boolean): void;
	reservation: Reservation;
	newEmployeeId?: number;
	newTime?: Date;
	onCancel(): void;
}

const MoveReservationModal: FC<MoveReservationModalProp> = ({
	open,
	setOpen,
	reservation,
	newEmployeeId,
	newTime,
	onCancel,
}) => {
	return (
		<BaseModal
			open={open}
			setOpen={setOpen}
			onOutsideTouchCancel={(open: boolean) => {
				if (!open) onCancel();
			}}
			contentElement={
				<MoveReservation
					setOpen={setOpen}
					reservation={reservation}
					newEmployeeId={newEmployeeId}
					newTime={newTime}
					onCancel={onCancel}
				/>
			}
		/>
	);
};

export default MoveReservationModal;
