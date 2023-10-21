import { useState } from 'react';
import AddDate from '../miscallaneous/AddDate.Component';
import AddTime from '../miscallaneous/AddTime.Component';
import { Gender } from '../../../../models/enums';
import Employee from '../../../../models/Employee.Model';
import {
	useEmployeesContext,
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
import ToggleSwitch from '../profile/settings/ToggleSwitch.Commponent';

interface AddReservationProp {
	defaultDate?: Date;
	defaultTime?: Date;
	defaultEmployeeId?: number;
}

export default function AddReservation(prop: AddReservationProp) {
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

	const genders = Object.values(Gender).map((gender: Gender) => gender);
	let allEmployees: Employee[] = [];

	try {
		const { employees } = useEmployeesContext();
		allEmployees.push(...employees);
	} catch {}

	try {
		const { user } = useUserContext();
		allEmployees.push(user);
	} catch {}

	let allServices: Service[] = [];

	try {
		const { services } = useServicesContext();
		allServices.push(...services);
	} catch {}

	const employeeDropDownItems = getEmployeeDropDownItems(allEmployees);
	const serviceDropDownItems = getServiceDropDownItems(allServices);

	return (
		<div>
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
				default={genderDropDownItems[0]}
				options={genderDropDownItems}
				onSelect={(option) => {
					if (option.id == null) setGender(null);
					else setGender(option.id as Gender);
				}}
				label='Requested Gender'
				required={false}
			/>

			<AddDropDown
				default={employeeDropDownItems[prop.defaultEmployeeId || 0]}
				options={employeeDropDownItems}
				onSelect={(option) => {
					if (option.id == null) setEmployeeId(null);
					else setEmployeeId(option.id as number);
				}}
				label='Employee'
				required={false}
			/>

			<AddDropDown
				default={serviceDropDownItems[0]}
				options={serviceDropDownItems}
				onSelect={(option) => {
					if (option.id == null) setServiceId(null);
					else setServiceId(option.id as number);
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
	);
}
