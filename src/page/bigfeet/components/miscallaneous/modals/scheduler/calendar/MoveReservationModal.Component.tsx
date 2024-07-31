import { FC } from 'react';

import MoveReservation from './MoveReservation.Component';

import BaseModal from '../../BaseModal.Component';

import Reservation from '../../../../../../../models/Reservation.Model';
import User from '../../../../../../../models/User.Model';

import { UpdateReservationRequest } from '../../../../../../../models/requests/Reservation.Request.Model';

import { useUserQuery } from '../../../../../../../service/query/get-items.query';

interface MoveReservationModalProp {
	open: boolean;
	setOpen(open: boolean): void;
	reservation: Reservation;
	newEmployeeId?: number;
	newTime?: Date;
	editable: boolean;
	onEditReservation(
		reservationId: number,
		request: UpdateReservationRequest
	): Promise<void>;
	onCancel(): void;
}

const MoveReservationModal: FC<MoveReservationModalProp> = ({
	open,
	setOpen,
	reservation,
	newEmployeeId,
	newTime,
	editable,
	onEditReservation,
	onCancel,
}) => {
	const userQuery = useUserQuery({ gettable: true, staleTime: Infinity });
	const user: User = userQuery.data;

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
					updatedBy={user.username}
					reservation={reservation}
					newEmployeeId={newEmployeeId}
					newTime={newTime}
					editable={editable}
					onEditReservation={onEditReservation}
					onCancel={onCancel}
				/>
			}
		/>
	);
};

export default MoveReservationModal;
