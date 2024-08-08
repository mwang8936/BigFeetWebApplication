import { FC } from 'react';

import EditReservation from './EditReservation.Component';

import BaseModal from '../../BaseModal.Component';

import { useUserQuery } from '../../../../../../hooks/profile.hooks';

import Reservation from '../../../../../../../models/Reservation.Model';
import User from '../../../../../../../models/User.Model';

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
	const userQuery = useUserQuery({ gettable: true, staleTime: Infinity });
	const user: User = userQuery.data;

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
