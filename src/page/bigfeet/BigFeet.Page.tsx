import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useTranslation } from 'react-i18next';

import Loading from './components/Loading.Component';
import SideBar from './components/SideBar.Component';
import Retry from './components/Retry.Component';
import Customers from './components/customers/Customers.Component';
import Employees from './components/employees/Employees.Component';
import PayRoll from './components/payroll/PayRoll.Component';
import Profile from './components/profile/Profile.Component';
import Scheduler from './components/scheduler/Scheduler.Component';
import Services from './components/services/Services.Component';

import { Permissions } from '../../models/enums';
import User from '../../models/User.Model';

import {
	useSchedulesQuery,
	useUserQuery,
} from '../../service/query/get-items.query';
import { getLanguageFile } from '../../utils/i18n.utils';

export const enum SideBarItems {
	Profile = 0,
	Scheduler = 1,
	PayRoll = 2,
	Employees = 3,
	Services = 4,
	Customers = 5,
}

export default function BigFeet() {
	const [retryingUserQuery, setRetryingUserQuery] = useState(false);

	const [sideBarItems] = useState([SideBarItems.Profile]);

	const [selectedIndex, setSelectedIndex] = useState(0);

	const { i18n } = useTranslation();

	const userQuery = useUserQuery({
		gettable: true,
	});
	const user: User = userQuery.data;

	useEffect(() => {
		if (user) {
			i18n.changeLanguage(getLanguageFile(user.language));

			sideBarItems.push(SideBarItems.Scheduler, SideBarItems.PayRoll);

			const permissions = user.permissions;

			if (
				permissions.includes(Permissions.PERMISSION_GET_EMPLOYEE) ||
				permissions.includes(Permissions.PERMISSION_ADD_EMPLOYEE) ||
				permissions.includes(Permissions.PERMISSION_UPDATE_EMPLOYEE) ||
				permissions.includes(Permissions.PERMISSION_DELETE_EMPLOYEE)
			)
				sideBarItems.push(SideBarItems.Employees);

			if (
				permissions.includes(Permissions.PERMISSION_GET_SERVICE) ||
				permissions.includes(Permissions.PERMISSION_ADD_SERVICE) ||
				permissions.includes(Permissions.PERMISSION_UPDATE_SERVICE) ||
				permissions.includes(Permissions.PERMISSION_DELETE_SERVICE)
			)
				sideBarItems.push(SideBarItems.Services);

			if (
				permissions.includes(Permissions.PERMISSION_GET_CUSTOMER) ||
				permissions.includes(Permissions.PERMISSION_ADD_CUSTOMER) ||
				permissions.includes(Permissions.PERMISSION_UPDATE_CUSTOMER) ||
				permissions.includes(Permissions.PERMISSION_DELETE_CUSTOMER)
			)
				sideBarItems.push(SideBarItems.Customers);
		}
	}, [user]);

	const isUserLoading = userQuery.isLoading;

	const retryUserQuery = userQuery.refetch;
	const isUserError = userQuery.isError;
	const userError = userQuery.error;

	const isUserPaused = userQuery.isPaused;

	const pausedElement = isUserPaused ? (
		<Retry
			retrying={retryingUserQuery}
			error={'Network Connection Issue'}
			onRetry={() => {}}
			enabled={false}
		/>
	) : selectedIndex === 0 ? (
		<Profile />
	) : selectedIndex == 1 ? (
		<Scheduler />
	) : selectedIndex == 2 ? (
		<PayRoll />
	) : selectedIndex == 3 ? (
		<Employees />
	) : selectedIndex == 4 ? (
		<Services />
	) : (
		selectedIndex == 5 && <Customers />
	);

	const errorsElement = isUserError ? (
		<Retry
			retrying={retryingUserQuery}
			error={userError?.message as string}
			onRetry={() => {
				setRetryingUserQuery(true);
				retryUserQuery()
					.then(() => i18n.changeLanguage(getLanguageFile(user.language)))
					.finally(() => setRetryingUserQuery(false));
			}}
			enabled={true}
		/>
	) : (
		pausedElement
	);

	const isLoadingElement = isUserLoading ? <Loading /> : errorsElement;

	useSchedulesQuery({
		date: new Date(),
		gettable:
			user?.permissions?.includes(Permissions.PERMISSION_GET_SCHEDULE) ?? false,
		staleTime: 0,
		refetchInterval: 1000 * 60,
		refetchIntervalInBackground: true,
	});

	return (
		<div className="flex min-h-screen">
			<SideBar
				selectedIndex={selectedIndex}
				onIndexSelected={setSelectedIndex}
				sideBarItems={sideBarItems}
			/>

			{
				<div className="grid landscape:grow landscape:h-screen landscape:ml-[9%] portrait:w-screen portrait:mt-[20%] portrait:sm:mt-[12%]">
					{isLoadingElement}
					<ToastContainer limit={5} />
				</div>
			}
		</div>
	);
}
