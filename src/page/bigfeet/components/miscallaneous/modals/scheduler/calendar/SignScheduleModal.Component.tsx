import { FC } from 'react';

import SignSchedule from './SignSchedule.Component';

import BaseModal from '../../BaseModal.Component';

interface SignScheduleModalProp {
	open: boolean;
	setOpen(open: boolean): void;
	employeeId: number;
}

const SignScheduleModal: FC<SignScheduleModalProp> = ({
	open,
	setOpen,
	employeeId,
}) => {
	return (
		<BaseModal
			open={open}
			setOpen={setOpen}
			contentElement={
				<SignSchedule setOpen={setOpen} employeeId={employeeId} />
			}
		/>
	);
};

export default SignScheduleModal;
