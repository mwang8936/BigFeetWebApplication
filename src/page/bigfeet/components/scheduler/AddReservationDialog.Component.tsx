import { Fragment, useEffect, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { Gender } from '../../../../models/enums';
import Employee from '../../../../models/Employee.Model';
import {
	useEmployeesContext,
	useSchedulesContext,
	useServicesContext,
	useUserContext,
} from '../../BigFeet.Page';
import Service from '../../../../models/Service.Model';
import {
	genderDropDownItems,
	getEmployeeDropDownItems,
	getServiceDropDownItems,
} from '../../../../constants/drop-down.constants';
import AddDropDown from '../miscallaneous/AddDropDown.Component';
import AddTime from '../miscallaneous/AddTime.Component';
import AddDate from '../miscallaneous/AddDate.Component';
import ToggleSwitch from '../profile/settings/ToggleSwitch.Commponent';
import { addReservation } from '../../../../service/reservation.service';
import { useNavigate } from 'react-router-dom';
import Reservation from '../../../../models/Reservation.Model';

interface AddReservationDialogProp {
	open: boolean;
	setOpen(open: boolean): void;
	defaultDate?: Date;
	defaultTime?: Date;
	defaultEmployeeId?: number;
}

export default function AddReservationDialog(prop: AddReservationDialogProp) {
	const navigate = useNavigate();

	useEffect(() => {
		setTime(prop.defaultTime);
	}, [prop.defaultTime]);

	const { schedules, setSchedules } = useSchedulesContext();
	const { user } = useUserContext();
	const [date, setDate] = useState<Date | null>(
		prop.defaultDate || new Date()
	);
	const [time, setTime] = useState<Date | null>(
		prop.defaultTime || new Date()
	);
	const [employeeId, setEmployeeId] = useState<number | null>(
		prop.defaultEmployeeId || null
	);
	const [serviceId, setServiceId] = useState<number | null>(null);
	const [gender, setGender] = useState<Gender | null>(null);

	let allEmployees: Employee[] = [];

	try {
		const { employees } = useEmployeesContext();
		allEmployees.push(...employees);
	} catch {}

	let allServices: Service[] = [];

	try {
		const { services } = useServicesContext();
		allServices.push(...services);
	} catch {}

	const employeeDropDownItems = getEmployeeDropDownItems(allEmployees);
	const serviceDropDownItems = getServiceDropDownItems(allServices);

	const cancelButtonRef = useRef(null);

	const onAdd = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (!date || !time || !serviceId || !user.username) {
			//setAddError('Missing Required Field');
		} else {
			const addReservationRequest = {
				date,
				employee_id: employeeId,
				reserved_time: time,
				service_id: serviceId,
				created_by: user.username,
			};

			//setAdding(true);
			addReservation(navigate, addReservationRequest).then((response) => {
				const reservation: Reservation = response;
				const updatedSchedule = schedules.find(
					(schedule) =>
						schedule.date == date &&
						schedule.employee?.employee_id == employeeId
				);
				if (updatedSchedule) {
					if (updatedSchedule.reservations) {
						updatedSchedule.reservations.push(reservation);
					} else {
						updatedSchedule.reservations = [reservation];
					}
					setSchedules(
						schedules.map((schedule) =>
							schedule.date == updatedSchedule.date &&
							schedule.employee?.employee_id ==
								updatedSchedule.employee?.employee_id
								? updatedSchedule
								: schedule
						)
					);
				}
			});
			//.catch((error) => setAddError(error.message))
			//.finally(() => setAdding(false));
		}
	};
	return (
		<Transition.Root show={prop.open} as={Fragment}>
			<Dialog
				as='div'
				className='relative z-10'
				initialFocus={cancelButtonRef}
				onClose={prop.setOpen}
			>
				<Transition.Child
					as={Fragment}
					enter='ease-out duration-300'
					enterFrom='opacity-0'
					enterTo='opacity-100'
					leave='ease-in duration-200'
					leaveFrom='opacity-100'
					leaveTo='opacity-0'
				>
					<div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
				</Transition.Child>

				<div className='fixed inset-0 z-10 overflow-y-auto'>
					<div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
						<Transition.Child
							as={Fragment}
							enter='ease-out duration-300'
							enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
							enterTo='opacity-100 translate-y-0 sm:scale-100'
							leave='ease-in duration-200'
							leaveFrom='opacity-100 translate-y-0 sm:scale-100'
							leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
						>
							<form onSubmit={onAdd}>
								<Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg'>
									<div className='bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4'>
										<div className='sm:flex sm:items-start'>
											<div className='mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10'>
												<PlusCircleIcon
													className='h-6 w-6 text-green-600'
													aria-hidden='true'
												/>
											</div>
											<div className='mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full'>
												<Dialog.Title
													as='h3'
													className='text-base font-semibold leading-6 text-gray-900'
												>
													Add Reservation
												</Dialog.Title>
												<div className='mt-2'>
													<AddDate
														label='Select Date'
														defaultDate={date}
														onDateSelected={setDate}
														required={true}
														requiredMessage='Date cannot be empty.'
														invalidMessage='Invalid Date.'
													/>

													<AddTime
														label='Select Time'
														defaultTime={time}
														onTimeSelected={setTime}
														required={true}
														requiredMessage='Time cannot be empty.'
														invalidMessage='Invalid Time.'
													/>

													<AddDropDown
														default={
															genderDropDownItems[0]
														}
														options={
															genderDropDownItems
														}
														onSelect={(option) => {
															if (
																option.id ==
																null
															)
																setGender(null);
															else
																setGender(
																	option.id as Gender
																);
														}}
														label='Requested Gender'
														required={false}
													/>

													<AddDropDown
														default={
															employeeDropDownItems.find(
																(dropDown) =>
																	dropDown.id ==
																	prop.defaultEmployeeId
															) ||
															employeeDropDownItems[0]
														}
														options={
															employeeDropDownItems
														}
														onSelect={(option) => {
															if (
																option.id ==
																null
															)
																setEmployeeId(
																	null
																);
															else
																setEmployeeId(
																	option.id as number
																);
														}}
														label='Employee'
														required={false}
													/>

													<AddDropDown
														default={
															serviceDropDownItems[0]
														}
														options={
															serviceDropDownItems
														}
														onSelect={(option) => {
															if (
																option.id ==
																null
															)
																setServiceId(
																	null
																);
															else
																setServiceId(
																	option.id as number
																);
														}}
														label='Service'
														required={true}
														requiredMessage='A service must be selected.'
													/>

													<ToggleSwitch
														name='requested_employee'
														checked={false}
														falseText='Not Requested'
														trueText='Requested'
													/>
												</div>
											</div>
										</div>
									</div>
									<div className='bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6'>
										<button
											type='submit'
											className='inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto'
										>
											Create
										</button>
										<button
											type='button'
											className='mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto'
											onClick={() => prop.setOpen(false)}
											ref={cancelButtonRef}
										>
											Cancel
										</button>
									</div>
								</Dialog.Panel>
							</form>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	);
}
