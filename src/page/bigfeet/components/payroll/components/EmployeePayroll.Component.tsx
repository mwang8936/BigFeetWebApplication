import { FC, useState } from 'react';

import AcupuncturistPayrollTable from './AcupuncturistPayrollTable.Component';
import AcupunctureReportTable from './AcupunctureReportTable.Component';
import GenerateAcupunctureReport from './GenerateAcupunctureReport.Component';
import GeneratePayroll from './GeneratePayroll.Component';
import ReceptionistPayrollTable from './ReceptionistPayrollTable.Component';
import StoreEmployeePayrollTable from './StoreEmployeePayrollTable.Component';
import StoreEmployeeWithCashAndTipsPayrollTable from './StoreEmployeeWithCashAndTipsPayrollTable.Component';

import { usePayrollDateContext } from '../PayRoll.Component';

import Carousel from '../../miscallaneous/Carousel.Component';

import { useAcupunctureReportsQuery } from '../../../../hooks/acupuncture-report.hooks';
import { usePayrollsQuery } from '../../../../hooks/payroll.hooks';
import { useUserQuery } from '../../../../hooks/profile.hooks';

import AcupunctureReport from '../../../../../models/Acupuncture-Report.Model';
import Employee from '../../../../../models/Employee.Model';
import {
	PayrollOption,
	PayrollPart,
	Permissions,
	Role,
} from '../../../../../models/enums';
import Payroll from '../../../../../models/Payroll.Model';
import User from '../../../../../models/User.Model';
import FilledPermissionsButton from '../../miscallaneous/FilledPermissionsButton.Component';
import { ButtonType } from '../../miscallaneous/PermissionsButton.Component';

interface EmployeePayrollProp {
	employee: Employee;
}

const EmployeePayroll: FC<EmployeePayrollProp> = ({ employee }) => {
	const { date } = usePayrollDateContext();

	const [isCashOutMode, setIsCashOutMode] = useState<boolean>(false);

	const userQuery = useUserQuery({ gettable: true, staleTime: Infinity });
	const user: User = userQuery.data;

	const gettable = user.permissions.includes(
		Permissions.PERMISSION_GET_PAYROLL
	);

	const acupunctureReportQuery = useAcupunctureReportsQuery({
		year: date.year,
		month: date.month,
		gettable,
	});

	const acupunctureReport: AcupunctureReport | undefined = (
		acupunctureReportQuery.data || []
	).find(
		(acupunctureReport) =>
			acupunctureReport.employee.employee_id === employee.employee_id
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
					items.push(
						<AcupuncturistPayrollTable
							payroll={payroll}
							isCashOutMode={isCashOutMode}
						/>
					);
					break;
				case PayrollOption.RECEPTIONIST:
					items.push(
						<ReceptionistPayrollTable
							payroll={payroll}
							isCashOutMode={isCashOutMode}
						/>
					);
					break;
				case PayrollOption.STORE_EMPLOYEE:
					items.push(
						<StoreEmployeePayrollTable
							payroll={payroll}
							isCashOutMode={isCashOutMode}
						/>
					);
					break;
				case PayrollOption.STORE_EMPLOYEE_WITH_TIPS_AND_CASH:
					items.push(
						<StoreEmployeeWithCashAndTipsPayrollTable
							payroll={payroll}
							isCashOutMode={isCashOutMode}
						/>
					);
					break;
			}
		} else {
			items.push(<GeneratePayroll employee={employee} part={part} />);
		}
	});

	if (employee.role === Role.ACUPUNCTURIST) {
		if (acupunctureReport) {
			items.push(
				<AcupunctureReportTable acupunctureReport={acupunctureReport} />
			);
		} else {
			items.push(<GenerateAcupunctureReport employee={employee} />);
		}
	}

	return (
		<div className="flex flex-col flex-shrink-0 overflow-hidden">
			<Carousel items={items} />
			{payrolls.length > 0 && (
				<FilledPermissionsButton
					btnType={isCashOutMode ? ButtonType.ADD : ButtonType.CANCEL}
					btnTitle={isCashOutMode ? 'Payroll' : 'Cash Out'}
					disabled={false}
					missingPermissionMessage={''}
					onClick={() => {
						setIsCashOutMode(!isCashOutMode);
					}}
				/>
			)}
		</div>
	);
};

export default EmployeePayroll;
