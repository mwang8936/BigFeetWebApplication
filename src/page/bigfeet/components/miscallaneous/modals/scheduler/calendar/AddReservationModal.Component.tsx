import { FC } from 'react';
import BaseModal from '../../BaseModal.Component';
import AddReservation from './AddReservation.Component';
import { useUserContext } from '../../../../../BigFeet.Page';
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
	const { user } = useUserContext();

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
