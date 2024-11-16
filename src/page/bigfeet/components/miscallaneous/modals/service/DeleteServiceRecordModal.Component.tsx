import { FC } from 'react';

import DeleteServiceRecord from './DeleteServiceRecord.Component';

import BaseModal from '../BaseModal.Component';

import { ServiceRecord } from '../../../../../../models/Service.Model';

interface DeleteServiceRecordModalProp {
	open: boolean;
	setOpen(open: boolean): void;
	record: ServiceRecord;
}

const DeleteServiceRecordModal: FC<DeleteServiceRecordModalProp> = ({
	open,
	setOpen,
	record,
}) => {
	return (
		<BaseModal
			open={open}
			setOpen={setOpen}
			contentElement={<DeleteServiceRecord setOpen={setOpen} record={record} />}
		/>
	);
};

export default DeleteServiceRecordModal;
