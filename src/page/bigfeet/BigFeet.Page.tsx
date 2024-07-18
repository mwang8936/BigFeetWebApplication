import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useTranslation } from 'react-i18next';

import { getCustomers } from '../../service/customer.service';
import { getEmployees } from '../../service/employee.service';
import { getProfile, getProfileSchedules } from '../../service/profile.service';
import { getSchedules } from '../../service/schedule.service';
import { getServices } from '../../service/service.service';

import Loading from './components/Loading.Component';
import SideBar from './components/SideBar.Component';
import Retry from './components/Retry.Component';
import Customers from './components/customers/Customers.Component';
import Employees from './components/employees/Employees.Component';
import PayRoll from './components/payroll/PayRoll.Component';
import Profile from './components/profile/Profile.Component';
import Scheduler from './components/scheduler/Scheduler.Component';
import Services from './components/services/Services.Component';

import Employee from '../../models/Employee.Model';
import { Permissions } from '../../models/enums';
import Schedule from '../../models/Schedule.Model';
import User from '../../models/User.Model';

import {
	getBeginningOfMonth,
	getBeginningOfNextMonth,
} from '../../utils/date.utils';

import { userKey } from '../../constants/api.constants';
import { getLanguageFile } from '../../constants/language.constants';
import { useQuery } from '@tanstack/react-query';

export const enum SideBarItems {
	Profile = 0,
	Scheduler = 1,
	PayRoll = 2,
	Employees = 3,
	Services = 4,
	Customers = 5,
}

const UserContext = createContext<
	{ user: User; setUser(user: User): void } | undefined
>(undefined);

export function useUserContext() {
	const context = useContext(UserContext);
	if (context === undefined) {
		throw new Error('useUserContext must be within UserProvider.');
	}

	return context;
}

const SchedulesContext = createContext<{
	schedules: Schedule[];
	setSchedules(schedules: Schedule[]): void;
}>({ schedules: [], setSchedules: () => {} });

export function useSchedulesContext() {
	return useContext(SchedulesContext);
}

export default function BigFeet() {
	const navigate = useNavigate();

	const [loading, setLoading] = useState(false);

	const [user, setUser] = useState<User>();
	const [retryingUser, setRetryingUser] = useState(false);
	const [userError, setUserError] = useState('');

	const [schedules, setSchedules] = useState<Schedule[]>([]);
	const [retryingSchedules, setRetryingSchedules] = useState(false);
	const [schedulesError, setSchedulesError] = useState('');

	const [sideBarItems] = useState([SideBarItems.Profile]);

	const [selectedIndex, setSelectedIndex] = useState(0);

	useEffect(() => {
		setLoading(true);
		getItems().finally(() => setLoading(false));
	}, []);

	const { i18n } = useTranslation();

	const getItems = async () => {
		const storageUser = sessionStorage.getItem(userKey);
		if (storageUser) {
			const reviveDateTime = (_: any, value: any): any => {
				if (typeof value === 'string') {
					const a =
						/(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/.exec(
							value
						);
					if (a) {
						return new Date(value);
					}
				}

				return value;
			};

			const user: User = JSON.parse(storageUser, reviveDateTime);
			setUser(user);
			i18n.changeLanguage(getLanguageFile(user.language));

			sideBarItems.push(SideBarItems.Scheduler, SideBarItems.PayRoll);

			const permissions = user.permissions;

			if (permissions.includes(Permissions.PERMISSION_GET_SCHEDULE)) {
				getSchedules(navigate, {
					start: getBeginningOfMonth(new Date()),
					end: getBeginningOfNextMonth(new Date()),
				})
					.then((response) => setSchedules(response))
					.catch((error) => setSchedulesError(error.message));
			} else {
				getProfileSchedules(navigate)
					.then((response) => setSchedules(response))
					.catch((error) => setSchedulesError(error.message));
			}

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
	};

	const retryGetUser = async () => {
		setRetryingUser(true);
		getProfile(navigate)
			.then((response) => {
				sessionStorage.setItem(userKey, JSON.stringify(response));
				setUser(response);
				i18n.changeLanguage(getLanguageFile(response.language));

				getItems().finally(() => setLoading(false));
				setUserError('');
			})
			.catch((error) => setUserError(error.message))
			.finally(() => setRetryingUser(false));
	};

	const retryGetSchedules = async () => {
		if (user) {
			setRetryingSchedules(true);
			if (user.permissions.includes(Permissions.PERMISSION_GET_SCHEDULE)) {
				getSchedules(navigate, {})
					.then((response) => {
						setSchedules(response);
						setSchedulesError('');
					})
					.catch((error) => setSchedulesError(error.message))
					.finally(() => setRetryingSchedules(false));
			} else {
				getProfileSchedules(navigate)
					.then((response) => {
						setSchedules(response);
						setSchedulesError('');
					})
					.catch((error) => setSchedulesError(error.message))
					.finally(() => setRetryingSchedules(false));
			}
		} else {
			setSchedulesError('Reload User Profile First.');
		}
	};

	const UserContainer = (children: React.ReactNode) => {
		return user ? (
			<UserContext.Provider value={{ user, setUser }}>
				{children}
			</UserContext.Provider>
		) : (
			<>{children}</>
		);
	};

	return (
		<div className="flex min-h-screen">
			<SideBar
				selectedIndex={selectedIndex}
				onIndexSelected={setSelectedIndex}
				sideBarItems={sideBarItems}
			/>

			{UserContainer(
				<SchedulesContext.Provider value={{ schedules, setSchedules }}>
					<div className="grid landscape:grow landscape:h-screen landscape:ml-[9%] portrait:w-screen portrait:mt-[20%] portrait:sm:mt-[12%]">
						{loading ? (
							<Loading />
						) : selectedIndex == 0 ? (
							user ? (
								<Profile />
							) : (
								<Retry
									retrying={retryingUser}
									error={userError}
									onRetry={retryGetUser}
								/>
							)
						) : selectedIndex == 1 ? (
							schedules ? (
								<Scheduler />
							) : (
								<Retry
									retrying={retryingSchedules}
									error={schedulesError}
									onRetry={retryGetSchedules}
								/>
							)
						) : selectedIndex == 2 ? (
							schedules ? (
								<PayRoll />
							) : (
								<Retry
									retrying={retryingSchedules}
									error={schedulesError}
									onRetry={retryGetSchedules}
								/>
							)
						) : selectedIndex == 3 ? (
							<Employees />
						) : selectedIndex == 4 ? (
							<Services />
						) : (
							selectedIndex == 5 && <Customers />
						)}
						<ToastContainer limit={5} />
					</div>
				</SchedulesContext.Provider>
			)}
		</div>
	);
}
