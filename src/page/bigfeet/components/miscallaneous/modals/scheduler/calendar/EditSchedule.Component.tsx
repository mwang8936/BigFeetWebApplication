import { FC, useState, useEffect } from 'react';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { Dialog } from '@headlessui/react';
import Schedule from '../../../../../../../models/Schedule.Model';
import { UpdateScheduleRequest } from '../../../../../../../models/requests/Schedule.Request.Model';
import { sameTime } from '../../../../../../../utils/date.utils';
import { ToggleColor } from '../../../add/AddToggleSwitch.Component';
import LABELS from '../../../../../../../constants/label.constants';
import NAMES from '../../../../../../../constants/name.constants';
import ERRORS from '../../../../../../../constants/error.constants';
import STORES from '../../../../../../../constants/store.constants';
import EditBottom from '../../EditBottom.Component';
import EditableTime from '../../../editable/EditableTime.Component';
import EditableToggleSwitch from '../../../editable/EditableToggleSwitch.Component';
import { useTranslation } from 'react-i18next';
import Employee from '../../../../../../../models/Employee.Model';
import { Permissions, Role } from '../../../../../../../models/enums';
import { getPriorityDropDownItems } from '../../../../../../../constants/drop-down.constants';
import EditableDropDown from '../../../editable/EditableDropDown.Component';
import User from '../../../../../../../models/User.Model';
import { useEmployeesQuery } from '../../../../../../hooks/employee.hooks';
import { useSchedulesQuery } from '../../../../../../hooks/schedule.hooks';
import { useUserQuery } from '../../../../../../hooks/profile.hooks';

interface EditScheduleProp {
	setOpen(open: boolean): void;
	schedule: Schedule;
	editable: boolean;
	onEditSchedule(
		date: Date,
		employeeId: number,
		request: UpdateScheduleRequest
	): Promise<void>;
}

const EditSchedule: FC<EditScheduleProp> = ({
	setOpen,
	schedule,
	editable,
	onEditSchedule,
}) => {
	const { t } = useTranslation();

	const [priorityInput, setPriorityInput] = useState<number | null>(
		schedule.priority
	);
	const [startInput, setStartInput] = useState<Date | null>(schedule.start);
	const [endInput, setEndInput] = useState<Date | null>(schedule.end);
	const [isWorkingInput, setIsWorkingInput] = useState<boolean>(
		schedule.is_working
	);
	const [onCallInput, setOnCallInput] = useState<boolean>(schedule.on_call);

	const [invalidStart, setInvalidStart] = useState<boolean>(false);
	const [invalidEnd, setInvalidEnd] = useState<boolean>(false);

	const [changesMade, setChangesMade] = useState<boolean>(false);
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
		date: schedule.date,
		gettable: scheduleGettable,
		staleTime: Infinity,
	});
	const schedules: Schedule[] = (
		(scheduleQuery.data as Schedule[]) || []
	).filter((schedule) => schedule.employee.role !== Role.DEVELOPER);

	const priorityDropDownItems = getPriorityDropDownItems(
		employees,
		schedules.filter(
			(filteredSchedule) => filteredSchedule.priority !== schedule.priority
		)
	);

	useEffect(() => {
		const start: Date | null | undefined =
			startInput && schedule.start && sameTime(startInput, schedule.start)
				? undefined
				: startInput === schedule.start
				? undefined
				: startInput;
		const end: Date | null | undefined =
			endInput && schedule.end && sameTime(endInput, schedule.end)
				? undefined
				: endInput === schedule.end
				? undefined
				: endInput;
		const priority: number | null | undefined =
			priorityInput === schedule.priority ? undefined : priorityInput;
		const is_working: boolean | undefined =
			isWorkingInput === schedule.is_working ? undefined : isWorkingInput;
		const on_call: boolean | undefined =
			onCallInput === schedule.on_call ? undefined : onCallInput;

		const changesMade =
			start !== undefined ||
			end !== undefined ||
			priority !== undefined ||
			is_working !== undefined ||
			on_call !== undefined;

		setChangesMade(changesMade);
	}, [startInput, endInput, priorityInput, isWorkingInput, onCallInput]);

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

	const onEdit = () => {
		const start: Date | null | undefined =
			startInput && schedule.start && sameTime(startInput, schedule.start)
				? undefined
				: startInput === schedule.start
				? undefined
				: startInput;
		const end: Date | null | undefined =
			endInput && schedule.end && sameTime(endInput, schedule.end)
				? undefined
				: endInput === schedule.end
				? undefined
				: endInput;
		const priority: number | null | undefined =
			priorityInput === schedule.priority ? undefined : priorityInput;
		const is_working: boolean | undefined =
			isWorkingInput === schedule.is_working ? undefined : isWorkingInput;
		const on_call: boolean | undefined =
			onCallInput === schedule.on_call ? undefined : onCallInput;

		const updateScheduleRequest: UpdateScheduleRequest = {
			...(start !== undefined && { start }),
			...(end !== undefined && { end }),
			...(priority !== undefined && { priority }),
			...(is_working !== undefined && { is_working }),
			...(on_call !== undefined && { on_call }),
		};

		onEditSchedule(
			schedule.date,
			schedule.employee.employee_id,
			updateScheduleRequest
		);
		setOpen(false);
	};

	return (
		<>
			<div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
				<div className="sm:flex sm:items-start">
					<div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
						<PencilSquareIcon
							className="h-6 w-6 text-blue-600"
							aria-hidden="true"
						/>
					</div>
					<div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
						<Dialog.Title
							as="h3"
							className="text-base font-semibold leading-6 text-gray-900">
							{t('Edit Schedule')}
						</Dialog.Title>
						<div className="mt-2">
							<EditableDropDown
								originalOption={
									priorityDropDownItems[
										priorityDropDownItems.findIndex(
											(option) => option.id === schedule.priority
										) || 0
									]
								}
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
								editable={editable}
								missingPermissionMessage={ERRORS.schedule.permissions.edit}
							/>
							<EditableTime
								originalTime={schedule.start}
								time={startInput}
								setTime={setStartInput}
								label={LABELS.schedule.start}
								validationProp={{
									min: STORES.start,
									max: STORES.end,
									required: false,
									requiredMessage: ERRORS.schedule.start.required,
									invalid: invalidStart,
									setInvalid: setInvalidStart,
									invalidMessage: ERRORS.schedule.start.invalid,
								}}
								editable={editable}
								missingPermissionMessage={ERRORS.schedule.permissions.edit}
							/>
							{startInput && !invalidStart && (
								<EditableTime
									originalTime={schedule.end}
									time={endInput}
									setTime={setEndInput}
									label={LABELS.schedule.end}
									validationProp={{
										min: startInput.getHours() + startInput.getMinutes() / 60,
										max: STORES.end,
										required: false,
										requiredMessage: ERRORS.schedule.end.required,
										invalid: invalidEnd,
										setInvalid: setInvalidEnd,
										invalidMessage: ERRORS.schedule.end.invalid,
									}}
									editable={editable}
									missingPermissionMessage={ERRORS.schedule.permissions.edit}
								/>
							)}

							<EditableToggleSwitch
								originalChecked={schedule.is_working}
								checked={isWorkingInput}
								setChecked={setIsWorkingInput}
								falseText={t('Not Working')}
								trueText={t('Working')}
								toggleColour={ToggleColor.BLUE}
								label={LABELS.schedule.is_working}
								name={NAMES.schedule.is_working}
								editable={editable}
								missingPermissionMessage={ERRORS.schedule.permissions.edit}
							/>

							<EditableToggleSwitch
								originalChecked={schedule.on_call}
								checked={onCallInput}
								setChecked={setOnCallInput}
								falseText={t('Not On Call')}
								trueText={t('On Call')}
								toggleColour={ToggleColor.BLUE}
								label={LABELS.schedule.on_call}
								name={NAMES.schedule.on_call}
								editable={editable}
								missingPermissionMessage={ERRORS.schedule.permissions.edit}
							/>
						</div>
					</div>
				</div>
			</div>
			<EditBottom
				onCancel={() => setOpen(false)}
				disabledEdit={!editable || !changesMade || invalidInput}
				editMissingPermissionMessage={
					!editable
						? ERRORS.schedule.permissions.add
						: !changesMade
						? ERRORS.no_changes
						: invalidInput
						? ERRORS.invalid
						: ''
				}
				onEdit={onEdit}
			/>
		</>
	);
};

export default EditSchedule;
