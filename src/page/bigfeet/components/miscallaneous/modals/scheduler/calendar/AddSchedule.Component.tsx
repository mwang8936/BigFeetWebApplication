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
import AddDropDown from '../../../add/AddDropDown.Component';
import { Permissions, Role } from '../../../../../../../models/enums';
import Employee from '../../../../../../../models/Employee.Model';
import Schedule from '../../../../../../../models/Schedule.Model';
import { getPriorityDropDownItems } from '../../../../../../../constants/drop-down.constants';
import User from '../../../../../../../models/User.Model';
import { useEmployeesQuery } from '../../../../../../hooks/employee.hooks';
import { useSchedulesQuery } from '../../../../../../hooks/schedule.hooks';
import { useUserQuery } from '../../../../../../hooks/profile.hooks';

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

	const [priorityInput, setPriorityInput] = useState<number | null>(null);
	const [startInput, setStartInput] = useState<Date | null>(null);
	const [endInput, setEndInput] = useState<Date | null>(null);
	const [isWorkingInput, setIsWorkingInput] = useState<boolean>(true);
	const [onCallInput, setOnCallInput] = useState<boolean>(false);

	const [invalidStart, setInvalidStart] = useState<boolean>(false);
	const [invalidEnd, setInvalidEnd] = useState<boolean>(false);

	const [missingRequiredInput, setMissingRequiredInput] =
		useState<boolean>(false);
	const [invalidInput, setInvalidInput] = useState<boolean>(false);

	const userQuery = useUserQuery({ gettable: true, staleTime: Infinity });
	const user: User = userQuery.data;

	const employeeGettable = user.permissions.includes(
		Permissions.PERMISSION_GET_EMPLOYEE
	);
	const scheduleGettable = user.permissions.includes(
		Permissions.PERMISSION_GET_SCHEDULE
	);

	const employeeQuery = useEmployeesQuery({
		gettable: employeeGettable,
		staleTime: Infinity,
	});
	const employees: Employee[] = (
		(employeeQuery.data as Employee[]) || []
	).filter((employee) => employee.role !== Role.DEVELOPER);

	const scheduleQuery = useSchedulesQuery({
		date,
		gettable: scheduleGettable,
		staleTime: Infinity,
	});
	const schedules: Schedule[] = (
		(scheduleQuery.data as Schedule[]) || []
	).filter((schedule) => schedule.employee.role !== Role.DEVELOPER);

	const priorityDropDownItems = getPriorityDropDownItems(employees, schedules);

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
		const start: Date | undefined = startInput ?? undefined;
		const end: Date | undefined = endInput ?? undefined;
		const priority: number | undefined = priorityInput ?? undefined;
		const is_working: boolean = isWorkingInput;
		const on_call: boolean = onCallInput;

		const addScheduleRequest: AddScheduleRequest = {
			date,
			employee_id: employeeId,
			...(start !== undefined && { start }),
			...(end !== undefined && { end }),
			...(priority !== undefined && { priority }),
			is_working,
			on_call,
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
							<AddDropDown
								option={
									priorityDropDownItems[
										priorityDropDownItems.findIndex(
											(option) => option.id === priorityInput
										) || 0
									]
								}
								options={priorityDropDownItems}
								setOption={(option) => {
									setPriorityInput(option.id as number | null);
								}}
								label={LABELS.schedule.priority}
								validationProp={{
									required: false,
								}}
							/>
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
								falseText={t('Not Working')}
								trueText={t('Working')}
								toggleColour={ToggleColor.GREEN}
								label={LABELS.schedule.is_working}
								name={NAMES.schedule.is_working}
								disabled={false}
							/>

							<AddToggleSwitch
								checked={onCallInput}
								setChecked={setOnCallInput}
								falseText={t('Not On Call')}
								trueText={t('On Call')}
								toggleColour={ToggleColor.GREEN}
								label={LABELS.schedule.on_call}
								name={NAMES.schedule.on_call}
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
