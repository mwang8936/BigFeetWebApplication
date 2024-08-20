import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { SideBarItems } from '../BigFeet.Page';

import { useLogout } from '../../hooks/authentication.hooks';
import { usePrefetchCustomersQuery } from '../../hooks/customer.hooks';
import { usePrefetchEmployeesQuery } from '../../hooks/employee.hooks';
import { usePrefetchServicesQuery } from '../../hooks/service.hooks';

import CustomersIcon from '../../../assets/Customers_Icon.svg';
import EmployeesIcon from '../../../assets/Employees_Icon.svg';
import PayRollIcon from '../../../assets/Payroll_Icon.svg';
import ProfileIcon from '../../../assets/Profile_Icon.svg';
import SchedulerIcon from '../../../assets/Scheduler_Icon.svg';
import ServicesIcon from '../../../assets/Services_Icon.svg';

interface SideBarProp {
	selectedIndex: number;
	onIndexSelected(index: number): void;
	sideBarItems: SideBarItems[];
}

const SideBar: FC<SideBarProp> = ({
	selectedIndex,
	onIndexSelected,
	sideBarItems,
}) => {
	const { t } = useTranslation();

	const prefetchEmployees = usePrefetchEmployeesQuery();
	const prefetchServices = usePrefetchServicesQuery();
	const prefetchCustomers = usePrefetchCustomersQuery();

	const logout = useLogout();

	return (
		<div className="sidebar">
			{sideBarItems.includes(SideBarItems.Profile) && (
				<div
					className={
						selectedIndex === SideBarItems.Profile
							? 'sidebar-icon-selected group'
							: 'sidebar-icon group'
					}
					onClick={() => {
						onIndexSelected(SideBarItems.Profile);
					}}>
					<img src={ProfileIcon} className="h-16 w-16" />

					<span className="sidebar-tip group-hover:scale-100">
						{t('Profile')}
					</span>
				</div>
			)}

			{sideBarItems.includes(SideBarItems.Scheduler) && (
				<div
					className={
						selectedIndex === SideBarItems.Scheduler
							? 'sidebar-icon-selected group'
							: 'sidebar-icon group'
					}
					onClick={() => {
						onIndexSelected(SideBarItems.Scheduler);
					}}>
					<img src={SchedulerIcon} className="h-16 w-16" />

					<span className="sidebar-tip group-hover:scale-100">
						{t('Schedule')}
					</span>
				</div>
			)}

			{sideBarItems.includes(SideBarItems.PayRoll) && (
				<div
					className={
						selectedIndex === SideBarItems.PayRoll
							? 'sidebar-icon-selected group'
							: 'sidebar-icon group'
					}
					onClick={() => {
						onIndexSelected(SideBarItems.PayRoll);
					}}>
					<img src={PayRollIcon} className="h-16 w-16" />

					<span className="sidebar-tip group-hover:scale-100">
						{t('Pay Roll')}
					</span>
				</div>
			)}

			{sideBarItems.includes(SideBarItems.Employees) && (
				<div
					className={
						selectedIndex === SideBarItems.Employees
							? 'sidebar-icon-selected group'
							: 'sidebar-icon group'
					}
					onMouseEnter={prefetchEmployees}
					onClick={() => {
						onIndexSelected(SideBarItems.Employees);
					}}>
					<img src={EmployeesIcon} className="h-16 w-16" />

					<span className="sidebar-tip group-hover:scale-100">
						{t('Employees')}
					</span>
				</div>
			)}

			{sideBarItems.includes(SideBarItems.Services) && (
				<div
					className={
						selectedIndex === SideBarItems.Services
							? 'sidebar-icon-selected group'
							: 'sidebar-icon group'
					}
					onMouseEnter={prefetchServices}
					onClick={() => {
						onIndexSelected(SideBarItems.Services);
					}}>
					<img src={ServicesIcon} className="h-16 w-16" />

					<span className="sidebar-tip group-hover:scale-100">
						{t('Services')}
					</span>
				</div>
			)}

			{sideBarItems.includes(SideBarItems.Customers) && (
				<div
					className={
						selectedIndex === SideBarItems.Customers
							? 'sidebar-icon-selected group'
							: 'sidebar-icon group'
					}
					onMouseEnter={prefetchCustomers}
					onClick={() => {
						onIndexSelected(SideBarItems.Customers);
					}}>
					<img src={CustomersIcon} className="h-16 w-16" />

					<span className="sidebar-tip group-hover:scale-100">
						{t('Customers')}
					</span>
				</div>
			)}

			<div className="sidebar-icon sidebar-login" onClick={logout}>
				{t('Log Out')}
			</div>
		</div>
	);
};

export default SideBar;
