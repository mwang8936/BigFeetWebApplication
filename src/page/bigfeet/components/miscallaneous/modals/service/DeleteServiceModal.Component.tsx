import { FC } from 'react';

import DeleteService from './DeleteService.Component';

import BaseModal from '../BaseModal.Component';

interface DeleteServiceModalProp {
	open: boolean;
	setOpen(open: boolean): void;
	serviceId: number;
	serviceName: string;
	deletable: boolean;
	onDeleteService(serviceId: number): Promise<void>;
}

const DeleteServiceModal: FC<DeleteServiceModalProp> = ({
	open,
	setOpen,
	serviceId,
	serviceName,
	deletable,
	onDeleteService,
}) => {
	return (
		<BaseModal
			open={open}
			setOpen={setOpen}
			contentElement={
				<DeleteService
					setOpen={setOpen}
					serviceId={serviceId}
					serviceName={serviceName}
					deletable={deletable}
					onDeleteService={onDeleteService}
				/>
			}
		/>
	);
};

export default DeleteServiceModal;
