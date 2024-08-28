import { createContext, FC, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Loading from './components/Loading.Component';
import SideBar from './components/SideBar.Component';
import Retry from './components/Retry.Component';
import Customers from './components/customers/Customers.Component';
import Employees from './components/employees/Employees.Component';
import PayRoll from './components/payroll/PayRoll.Component';
import Profile from './components/profile/Profile.Component';
import Scheduler from './components/scheduler/Scheduler.Component';
import Services from './components/services/Services.Component';

import { useUserQuery } from '../hooks/profile.hooks';

import { Permissions, Role } from '../../models/enums';
import User from '../../models/User.Model';

import { getLanguageFile } from '../../utils/i18n.utils';
import PusherComponent from './components/Pusher.Component';

export const enum SideBarItems {
	Profile = 0,
	Scheduler = 1,
	PayRoll = 2,
	Employees = 3,
	Services = 4,
	Customers = 5,
}

const SocketIdContext = createContext<{
	socketId: string;
	setSocketId(socketId: string): void;
}>({ socketId: '', setSocketId: () => {} });

export function useSocketIdContext() {
	return useContext(SocketIdContext);
}

const BigFeet: FC = () => {
	const { i18n } = useTranslation();

	const [socketId, setSocketId] = useState<string>('');

	const [retryingUserQuery, setRetryingUserQuery] = useState(false);

	const [sideBarItems] = useState([
		SideBarItems.Profile,
		SideBarItems.Scheduler,
		SideBarItems.PayRoll,
	]);

	const [selectedIndex, setSelectedIndex] = useState(1);

	const userQuery = useUserQuery({
		gettable: true,
	});
	const user: User = userQuery.data;

	useEffect(() => {
		if (!user) return;

		i18n.changeLanguage(getLanguageFile(user.language));
	}, [user]);

	useEffect(() => {
		if (!user) return;

		const role = user.role;
		const permissions = user.permissions;

		if (
			[Role.DEVELOPER, Role.MANAGER].includes(role) &&
			(permissions.includes(Permissions.PERMISSION_GET_EMPLOYEE) ||
				permissions.includes(Permissions.PERMISSION_ADD_EMPLOYEE) ||
				permissions.includes(Permissions.PERMISSION_UPDATE_EMPLOYEE) ||
				permissions.includes(Permissions.PERMISSION_DELETE_EMPLOYEE))
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
	) : selectedIndex === SideBarItems.Profile ? (
		<Profile />
	) : selectedIndex == SideBarItems.Scheduler ? (
		<Scheduler />
	) : selectedIndex == SideBarItems.PayRoll ? (
		<PayRoll />
	) : selectedIndex == SideBarItems.Employees ? (
		<Employees />
	) : selectedIndex == SideBarItems.Services ? (
		<Services />
	) : (
		selectedIndex == SideBarItems.Customers && <Customers />
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

	return (
		<SocketIdContext.Provider value={{ socketId, setSocketId }}>
			<div className="fill-horizontal">
				<PusherComponent />

				<SideBar
					selectedIndex={selectedIndex}
					onIndexSelected={setSelectedIndex}
					sideBarItems={sideBarItems}
				/>

				<div className="content-fill">{isLoadingElement}</div>
			</div>

			<ToastContainer limit={5} />
		</SocketIdContext.Provider>
	);
};

export default BigFeet;
