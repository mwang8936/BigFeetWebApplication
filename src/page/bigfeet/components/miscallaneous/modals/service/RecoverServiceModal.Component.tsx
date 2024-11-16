import { FC } from 'react';

import RecoverService from './RecoverService.Component';

import BaseModal from '../BaseModal.Component';

import { Service } from '../../../../../../models/Service.Model';

interface RecoverServiceModalProp {
	open: boolean;
	setOpen(open: boolean): void;
	service: Service;
}

const RecoverServiceModal: FC<RecoverServiceModalProp> = ({
	open,
	setOpen,
	service,
}) => {
	return (
		<BaseModal
			open={open}
			setOpen={setOpen}
			contentElement={<RecoverService setOpen={setOpen} service={service} />}
		/>
	);
};

export default RecoverServiceModal;
