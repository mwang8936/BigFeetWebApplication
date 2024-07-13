import { FC, useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import AddTime from '../../../add/AddTime.Component';
import { AddScheduleRequest } from '../../../../../../../models/requests/Schedule.Request.Model';
import AddToggleSwitch, {
	ToggleColor,
} from '../../../add/AddToggleSwitch.Component';
import LABELS from '../../../../../../../constants/label.constants';
import NAMES from '../../../../../../../constants/name.constants';
import ERRORS from '../../../../../../../constants/error.constants';
import STORES from '../../../../../../../constants/store.constants';
import { PlusCircleIcon } from '@heroicons/react/20/solid';
import AddBottom from '../../AddBottom.Component';
import { useTranslation } from 'react-i18next';

interface AddScheduleProp {
	setOpen(open: boolean): void;
	employeeId: number;
	date: Date;
	creatable: boolean;
	onAddSchedule(request: AddScheduleRequest): Promise<void>;
}

const AddSchedule: FC<AddScheduleProp> = ({
	setOpen,
	employeeId,
	date,
	creatable,
	onAddSchedule,
}) => {
	const { t } = useTranslation();

	const [startInput, setStartInput] = useState<Date | null>(null);
	const [endInput, setEndInput] = useState<Date | null>(null);
	const [isWorkingInput, setIsWorkingInput] = useState<boolean>(true);

	const [invalidStart, setInvalidStart] = useState<boolean>(false);
	const [invalidEnd, setInvalidEnd] = useState<boolean>(false);

	const [missingRequiredInput, setMissingRequiredInput] =
		useState<boolean>(false);
	const [invalidInput, setInvalidInput] = useState<boolean>(false);

	useEffect(() => {
		const missingRequiredInput = !isWorkingInput;

		setMissingRequiredInput(missingRequiredInput);
	}, [startInput, endInput, isWorkingInput]);

	useEffect(() => {
		const invalidInput = invalidStart || invalidEnd;

		setInvalidInput(invalidInput);
	}, [invalidStart, invalidEnd]);

	useEffect(() => {
		if (startInput === null || invalidStart) {
			setEndInput(null);
			setInvalidEnd(false);
		}
	}, [startInput, invalidStart]);

	const onAdd = () => {
		const start: Date | undefined = startInput || undefined;
		const end: Date | undefined = endInput || undefined;
		const is_working: boolean = isWorkingInput;

		const addScheduleRequest: AddScheduleRequest = {
			date,
			employee_id: employeeId,
			...(start && { start }),
			...(end && { end }),
			is_working,
		};
		onAddSchedule(addScheduleRequest);
		setOpen(false);
	};

	return (
		<>
			<div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
				<div className="sm:flex sm:items-start">
					<div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
						<PlusCircleIcon
							className="h-6 w-6 text-green-600"
							aria-hidden="true"
						/>
					</div>
					<div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
						<Dialog.Title
							as="h3"
							className="text-base font-semibold leading-6 text-gray-900">
							{t('Add Schedule')}
						</Dialog.Title>
						<div className="mt-2">
							<AddTime
								time={startInput}
								setTime={setStartInput}
								label={LABELS.schedule.start}
								validationProp={{
									min: STORES.start,
									max: STORES.end,
									required: false,
									requiredMessage: ERRORS.schedule.start.required,
									invalid: startInput !== null ? invalidStart : false,
									setInvalid: setInvalidStart,
									invalidMessage: ERRORS.schedule.start.invalid,
								}}
							/>
							{startInput && !invalidStart && (
								<AddTime
									time={endInput}
									setTime={setEndInput}
									label={LABELS.schedule.end}
									validationProp={{
										min:
											startInput.getHours() +
											(startInput.getMinutes() + 1) / 60,
										max: STORES.end,
										required: false,
										requiredMessage: ERRORS.schedule.end.required,
										invalid: endInput !== null ? invalidEnd : false,
										setInvalid: setInvalidEnd,
										invalidMessage: ERRORS.schedule.end.invalid,
									}}
								/>
							)}

							<AddToggleSwitch
								checked={isWorkingInput}
								setChecked={setIsWorkingInput}
								falseText={'Not Working'}
								trueText={'Working'}
								toggleColour={ToggleColor.GREEN}
								label={LABELS.schedule.is_working}
								name={NAMES.schedule.is_working}
								disabled={false}
							/>
						</div>
					</div>
				</div>
			</div>
			<AddBottom
				onCancel={() => setOpen(false)}
				disabledAdd={!creatable || missingRequiredInput || invalidInput}
				addMissingPermissionMessage={
					!creatable
						? ERRORS.schedule.permissions.add
						: missingRequiredInput
						? ERRORS.required
						: invalidInput
						? ERRORS.invalid
						: ''
				}
				onAdd={onAdd}
			/>
		</>
	);
};

export default AddSchedule;
