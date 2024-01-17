import { FC } from 'react';
import BaseModal from '../../BaseModal.Component';
import { useUserContext } from '../../../../../BigFeet.Page';
import EditReservation from './EditReservation.Component';
import Reservation from '../../../../../../../models/Reservation.Model';
import { UpdateReservationRequest } from '../../../../../../../models/requests/Reservation.Request.Model';

interface EditReservationModalProp {
	open: boolean;
	setOpen(open: boolean): void;
	reservation: Reservation;
	employeeId: number;
	editable: boolean;
	onEditReservation(
		reservationId: number,
		request: UpdateReservationRequest
	): Promise<void>;
	deletable: boolean;
	onDeleteReservation(reservationId: number): Promise<void>;
}

const EditReservationModal: FC<EditReservationModalProp> = ({
	open,
	setOpen,
	reservation,
	employeeId,
	editable,
	onEditReservation,
	deletable,
	onDeleteReservation,
}) => {
	const { user } = useUserContext();

	return (
		<BaseModal
			open={open}
			setOpen={setOpen}
			contentElement={
				<EditReservation
					setOpen={setOpen}
					updatedBy={user.username}
					reservation={reservation}
					reservationEmployeeId={employeeId}
					editable={editable}
					onEditReservation={onEditReservation}
					deletable={deletable}
					onDeleteReservation={onDeleteReservation}
				/>
			}
		/>
	);
};

export default EditReservationModal;
