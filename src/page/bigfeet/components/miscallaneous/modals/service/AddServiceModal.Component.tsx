import { FC } from 'react';

import AddService from './AddService.Component';

import BaseModal from '../BaseModal.Component';

import { AddServiceRequest } from '../../../../../../models/requests/Service.Request.Model';

interface AddServiceModalProp {
	open: boolean;
	setOpen(open: boolean): void;
	creatable: boolean;
	onAddService(addServiceRequest: AddServiceRequest): Promise<void>;
}

const AddServiceModal: FC<AddServiceModalProp> = ({
	open,
	setOpen,
	creatable,
	onAddService,
}) => {
	return (
		<BaseModal
			open={open}
			setOpen={setOpen}
			contentElement={
				<AddService
					setOpen={setOpen}
					creatable={creatable}
					onAddService={onAddService}
				/>
			}
		/>
	);
};

export default AddServiceModal;
