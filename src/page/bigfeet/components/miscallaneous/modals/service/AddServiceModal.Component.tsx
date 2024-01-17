import { FC } from 'react';
import BaseModal from '../BaseModal.Component';
import { AddServiceRequest } from '../../../../../../models/requests/Service.Request.Model';
import AddService1 from './AddService.Component';

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
				<AddService1
					setOpen={setOpen}
					creatable={creatable}
					onAddService={onAddService}
				/>
			}
		/>
	);
};

export default AddServiceModal;
