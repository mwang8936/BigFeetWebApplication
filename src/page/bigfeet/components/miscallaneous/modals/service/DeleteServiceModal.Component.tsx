import { FC } from 'react';

import DeleteService from './DeleteService.Component';

import BaseModal from '../BaseModal.Component';

import Service from '../../../../../../models/Service.Model';

interface DeleteServiceModalProp {
	open: boolean;
	setOpen(open: boolean): void;
	service: Service;
}

const DeleteServiceModal: FC<DeleteServiceModalProp> = ({
	open,
	setOpen,
	service,
}) => {
	return (
		<BaseModal
			open={open}
			setOpen={setOpen}
			contentElement={<DeleteService setOpen={setOpen} service={service} />}
		/>
	);
};

export default DeleteServiceModal;
