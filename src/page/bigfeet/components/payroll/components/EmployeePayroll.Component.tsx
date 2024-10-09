import { FC } from 'react';

import AcupuncturistPayrollTable from './AcupuncturistPayrollTable.Component';
import GeneratePayroll from './GeneratePayroll.Component';
import ReceptionistPayrollTable from './ReceptionistPayrollTable.Component';
import StoreEmployeePayrollTable from './StoreEmployeePayrollTable.Component';
import StoreEmployeeWithCashAndTipsPayrollTable from './StoreEmployeeWithCashAndTipsPayrollTable.Component';

import { usePayrollDateContext } from '../PayRoll.Component';

import Carousel from '../../miscallaneous/Carousel.Component';

import { usePayrollsQuery } from '../../../../hooks/payroll.hooks';
import { useUserQuery } from '../../../../hooks/profile.hooks';

import Employee from '../../../../../models/Employee.Model';
import {
	PayrollOption,
	PayrollPart,
	Permissions,
	Role,
} from '../../../../../models/enums';
import Payroll from '../../../../../models/Payroll.Model';
import User from '../../../../../models/User.Model';

interface EmployeePayrollProp {
	employee: Employee;
}

const EmployeePayroll: FC<EmployeePayrollProp> = ({ employee }) => {
	const { date } = usePayrollDateContext();

	const userQuery = useUserQuery({ gettable: true, staleTime: Infinity });
	const user: User = userQuery.data;

	const gettable = user.permissions.includes(
		Permissions.PERMISSION_GET_PAYROLL
	);

	const payrollsQuery = usePayrollsQuery({
		year: date.year,
		month: date.month,
		gettable,
	});

	const payrolls: Payroll[] = (payrollsQuery.data || []).filter(
		(payroll) => payroll.employee.employee_id === employee.employee_id
	);

	const items: React.ReactNode[] = [];

	[PayrollPart.PART_1, PayrollPart.PART_2].forEach((part) => {
		const payroll = payrolls.find((payroll) => payroll.part === part);
		if (payroll) {
			switch (payroll.option) {
				case PayrollOption.ACUPUNCTURIST:
					items.push(<AcupuncturistPayrollTable payroll={payroll} />);
					break;
				case PayrollOption.RECEPTIONIST:
					items.push(<ReceptionistPayrollTable payroll={payroll} />);
					break;
				case PayrollOption.STORE_EMPLOYEE:
					items.push(<StoreEmployeePayrollTable payroll={payroll} />);
					break;
				case PayrollOption.STORE_EMPLOYEE_WITH_TIPS_AND_CASH:
					items.push(
						<StoreEmployeeWithCashAndTipsPayrollTable payroll={payroll} />
					);
					break;
			}
		} else {
			items.push(<GeneratePayroll employee={employee} part={part} />);
		}
	});

	if (employee.role === Role.ACUPUNCTURIST) {
		if (true) {
			// Check if acupuncture report exists
			items.push(
				<GeneratePayroll employee={employee} part={PayrollPart.PART_1} />
			);
		} else {
		}
	}

	return <Carousel items={items} />;
};

export default EmployeePayroll;
