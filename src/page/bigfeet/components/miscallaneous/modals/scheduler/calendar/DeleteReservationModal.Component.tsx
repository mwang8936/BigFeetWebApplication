import { FC } from 'react';
import BaseModal from '../../BaseModal.Component';
import DeleteReservation from './DeleteReservation.Component';

interface DeleteReservationModalProp {
	open: boolean;
	setOpen(open: boolean): void;
	reservationId: number;
	deletable: boolean;
	onDeleteReservation(reservationId: number): Promise<void>;
}

const DeleteReservationModal: FC<DeleteReservationModalProp> = ({
	open,
	setOpen,
	reservationId,
	deletable,
	onDeleteReservation,
}) => {
	return (
		<BaseModal
			open={open}
			setOpen={setOpen}
			contentElement={
				<DeleteReservation
					setOpen={setOpen}
					reservationId={reservationId}
					deletable={deletable}
					onDeleteReservation={onDeleteReservation}
				/>
			}
		/>
	);
};

export default DeleteReservationModal;
