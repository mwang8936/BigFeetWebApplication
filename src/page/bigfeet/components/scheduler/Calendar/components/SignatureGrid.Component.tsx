import { FC, useState } from 'react';

import AddToggleSwitch, {
	ToggleColor,
} from '../../../miscallaneous/add/AddToggleSwitch.Component';

import SignScheduleModal from '../../../miscallaneous/modals/scheduler/calendar/SignScheduleModal.Component';

import NAMES from '../../../../../../constants/name.constants';

import Employee from '../../../../../../models/Employee.Model';

interface SignatureGridProp {
	row: number;
	colNum: number;
	employee: Employee;
	signedOff: boolean;
}

const SignatureGrid: FC<SignatureGridProp> = ({
	row,
	colNum,
	employee,
	signedOff,
}) => {
	const [open, setOpen] = useState(false);

	return (
		<>
			<div
				style={{
					gridColumnStart: colNum,
					gridRowStart: row,
				}}
				onClick={() => {
					if (!signedOff) setOpen(true);
				}}
				className="border-slate-500 border-b border-r border-t-2">
				<div className="mt-1">
					<AddToggleSwitch
						checked={signedOff || false}
						setChecked={() => {}}
						falseText=""
						trueText={'Signed'}
						toggleColour={ToggleColor.BLUE}
						label={''}
						name={NAMES.schedule.sign_off}
						disabled={signedOff}
					/>
				</div>
			</div>

			<SignScheduleModal open={open} setOpen={setOpen} employee={employee} />
		</>
	);
};

export default SignatureGrid;
