import { FC } from 'react';

import AddReservation from './AddReservation.Component';

import BaseModal from '../../BaseModal.Component';

import { useUserQuery } from '../../../../../../hooks/profile.hooks';

import User from '../../../../../../../models/User.Model';

import { AddReservationRequest } from '../../../../../../../models/requests/Reservation.Request.Model';

interface AddReservationModalProp {
	open: boolean;
	setOpen(open: boolean): void;
	defaultDate?: Date;
	defaultEmployeeId?: number;
	creatable: boolean;
	onAddReservation(request: AddReservationRequest): Promise<void>;
}

const AddReservationModal: FC<AddReservationModalProp> = ({
	open,
	setOpen,
	defaultDate,
	defaultEmployeeId,
	creatable,
	onAddReservation,
}) => {
	const userQuery = useUserQuery({ gettable: true, staleTime: Infinity });
	const user: User = userQuery.data;

	return (
		<BaseModal
			open={open}
			setOpen={setOpen}
			contentElement={
				<AddReservation
					setOpen={setOpen}
					createdBy={user.username}
					defaultDate={defaultDate}
					defaultEmployeeId={defaultEmployeeId}
					creatable={creatable}
					onAddReservation={onAddReservation}
				/>
			}
		/>
	);
};

export default AddReservationModal;
