import { FC } from 'react';
import BaseModal from '../../BaseModal.Component';
import { useUserContext } from '../../../../../BigFeet.Page';
import Reservation from '../../../../../../../models/Reservation.Model';
import { UpdateReservationRequest } from '../../../../../../../models/requests/Reservation.Request.Model';
import MoveReservation from './MoveReservation.Component';

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
	const { user } = useUserContext();

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
