import SchedulerIcon from '../../../assets/Scheduler_Icon.svg';
import PayRollIcon from '../../../assets/Payroll_Icon.svg';
import EmployeesIcon from '../../../assets/Employees_Icon.svg';
import ProfileIcon from '../../../assets/Profile_Icon.svg';
import ServicesIcon from '../../../assets/Services_Icon.svg';
import CustomersIcon from '../../../assets/Customers_Icon.svg';
import { SideBarItems } from '../BigFeet.Page';
import { logout } from '../../../service/auth.service';
import { useAuthenticationContext } from '../../../App';
import { useTranslation } from 'react-i18next';

interface SideBarProp {
	selectedIndex: number;
	onIndexSelected(index: number): void;
	sideBarItems: SideBarItems[];
}

export default function SideBar(prop: SideBarProp) {
	const { t } = useTranslation();
	const { setAuthentication } = useAuthenticationContext();
	return (
		<div className="sidebar">
			{prop.sideBarItems.includes(SideBarItems.Profile) && (
				<div
					className={
						prop.selectedIndex === SideBarItems.Profile
							? 'sidebar-icon-selected group'
							: 'sidebar-icon group'
					}
					onClick={() => {
						prop.onIndexSelected(SideBarItems.Profile);
					}}>
					<img src={ProfileIcon} className="h-16 w-16" />
					<span className="sidebar-tip group-hover:scale-100">
						{t('Profile')}
					</span>
				</div>
			)}

			{prop.sideBarItems.includes(SideBarItems.Scheduler) && (
				<div
					className={
						prop.selectedIndex === SideBarItems.Scheduler
							? 'sidebar-icon-selected group'
							: 'sidebar-icon group'
					}
					onClick={() => {
						prop.onIndexSelected(SideBarItems.Scheduler);
					}}>
					<img src={SchedulerIcon} className="h-16 w-16" />
					<span className="sidebar-tip group-hover:scale-100">
						{t('Schedule')}
					</span>
				</div>
			)}

			{prop.sideBarItems.includes(SideBarItems.PayRoll) && (
				<div
					className={
						prop.selectedIndex === SideBarItems.PayRoll
							? 'sidebar-icon-selected group'
							: 'sidebar-icon group'
					}
					onClick={() => {
						prop.onIndexSelected(SideBarItems.PayRoll);
					}}>
					<img src={PayRollIcon} className="h-16 w-16" />
					<span className="sidebar-tip group-hover:scale-100">
						{t('Pay Roll')}
					</span>
				</div>
			)}

			{prop.sideBarItems.includes(SideBarItems.Employees) && (
				<div
					className={
						prop.selectedIndex === SideBarItems.Employees
							? 'sidebar-icon-selected group'
							: 'sidebar-icon group'
					}
					onClick={() => {
						prop.onIndexSelected(SideBarItems.Employees);
					}}>
					<img src={EmployeesIcon} className="h-16 w-16" />
					<span className="sidebar-tip group-hover:scale-100">
						{t('Employees')}
					</span>
				</div>
			)}

			{prop.sideBarItems.includes(SideBarItems.Services) && (
				<div
					className={
						prop.selectedIndex === SideBarItems.Services
							? 'sidebar-icon-selected group'
							: 'sidebar-icon group'
					}
					onClick={() => {
						prop.onIndexSelected(SideBarItems.Services);
					}}>
					<img src={ServicesIcon} className="h-16 w-16" />
					<span className="sidebar-tip group-hover:scale-100">
						{t('Services')}
					</span>
				</div>
			)}

			{prop.sideBarItems.includes(SideBarItems.Customers) && (
				<div
					className={
						prop.selectedIndex === SideBarItems.Customers
							? 'sidebar-icon-selected group'
							: 'sidebar-icon group'
					}
					onClick={() => {
						prop.onIndexSelected(SideBarItems.Customers);
					}}>
					<img src={CustomersIcon} className="h-16 w-16" />
					<span className="sidebar-tip group-hover:scale-100">
						{t('Customers')}
					</span>
				</div>
			)}

			<div
				className="sidebar-icon landscape:mt-auto landscape:py-5 portrait:ml-auto portrait:px-5 text-center"
				onClick={() => {
					logout(setAuthentication);
				}}>
				{t('Log Out')}
			</div>
		</div>
	);
}
