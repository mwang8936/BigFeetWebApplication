import { FC } from 'react';

import SignSchedule from './SignSchedule.Component';

import BaseModal from '../../BaseModal.Component';

interface SignScheduleModalProp {
	open: boolean;
	setOpen(open: boolean): void;
	date: Date;
	signable: boolean;
	onScheduleSigned(date: Date): Promise<void>;
}

const SignScheduleModal: FC<SignScheduleModalProp> = ({
	open,
	setOpen,
	date,
	signable,
	onScheduleSigned,
}) => {
	return (
		<BaseModal
			open={open}
			setOpen={setOpen}
			contentElement={
				<SignSchedule
					setOpen={setOpen}
					date={date}
					signable={signable}
					onScheduleSigned={onScheduleSigned}
				/>
			}
		/>
	);
};

export default SignScheduleModal;
