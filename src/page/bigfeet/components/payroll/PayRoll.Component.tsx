import { createContext, FC, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

import Tabs from '../miscallaneous/Tabs.Component';

import FilterPayrollsModal from '../miscallaneous/modals/payroll/FilterPayrollsModal.Component';

import { useEmployeesQuery } from '../../../hooks/employee.hooks';
import { useUserQuery } from '../../../hooks/profile.hooks';

import Employee from '../../../../models/Employee.Model';
import { Language, Permissions, Role } from '../../../../models/enums';
import User from '../../../../models/User.Model';

import { getYearMonthString } from '../../../../utils/date.utils';

import EmployeePayroll from './components/EmployeePayroll.Component';

const PayrollDateContext = createContext<
	| {
			date: { year: number; month: number };
			setDate(date: { year: number; month: number }): void;
	  }
	| undefined
>(undefined);

export function usePayrollDateContext() {
	const context = useContext(PayrollDateContext);
	if (context === undefined) {
		throw new Error(
			'usePayrollDateContext must be within PayrollDateProvider.'
		);
	}

	return context;
}

const PayRoll: FC = () => {
	const { t } = useTranslation();

	const [selectedTab, setSelectedTab] = useState(0);

	const [openFilterDialog, setOpenFilterDialog] = useState(false);

	const [date, setDate] = useState<{ year: number; month: number }>({
		year: new Date().getFullYear(),
		month: new Date().getMonth() + 1,
	});

	const userQuery = useUserQuery({ gettable: true, staleTime: Infinity });
	const user: User = userQuery.data;

	const gettable = user.permissions.includes(
		Permissions.PERMISSION_GET_EMPLOYEE
	);

	const employeeQuery = useEmployeesQuery({ gettable });

	const employees: Employee[] = (
		(employeeQuery.data as Employee[]) || [user]
	).filter((employee) => employee.role !== Role.DEVELOPER);

	const tabs: string[] = employees.map((employee) => employee.username);

	const employee = employees[selectedTab];

	const payrollsElement = employee ? (
		<EmployeePayroll employee={employee} />
	) : (
		<h1 className="large-centered-text">{t('No Employees Created')}</h1>
	);

	const tabsElement = (
		<>
			<Tabs
				tabs={tabs}
				selectedTab={selectedTab}
				onTabSelected={setSelectedTab}
			/>

			<div className="content-div">{payrollsElement}</div>
		</>
	);

	const language = user.language;

	const filtered =
		new Date().getMonth() + 1 !== date.month ||
		new Date().getFullYear() !== date.year;

	const displayDate = () => {
		let localeDateFormat;
		if (language === Language.SIMPLIFIED_CHINESE) {
			localeDateFormat = 'zh-CN';
		} else if (language === Language.TRADITIONAL_CHINESE) {
			localeDateFormat = 'zh-TW';
		} else {
			localeDateFormat = undefined;
		}

		return getYearMonthString(date.year, date.month, localeDateFormat);
	};

	return (
		<PayrollDateContext.Provider value={{ date, setDate }}>
			<div className="non-sidebar">
				<div className="title-bar">
					<h1 className="centered-title-text">{t('Payroll')}</h1>

					<h1 className="centered-title-text font-bold">{displayDate()}</h1>

					<div className="vertical-center">
						<AdjustmentsHorizontalIcon
							className={`h-16 w-16 ${
								filtered
									? 'text-blue-600 hover:text-blue-400'
									: 'text-gray-600 hover:text-gray-400'
							} my-auto me-10 cursor-pointer transition-colors duration-200 hover:scale-110`}
							onClick={() => setOpenFilterDialog(true)}
						/>
					</div>
				</div>

				{tabsElement}
			</div>

			<FilterPayrollsModal
				open={openFilterDialog}
				setOpen={setOpenFilterDialog}
			/>
		</PayrollDateContext.Provider>
	);
};

export default PayRoll;
