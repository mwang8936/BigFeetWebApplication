import { createContext, FC, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useQueryClient } from '@tanstack/react-query';

import Pusher, { Channel } from 'pusher-js';

import Loading from './components/Loading.Component';
import SideBar from './components/SideBar.Component';
import Retry from './components/Retry.Component';
import Customers from './components/customers/Customers.Component';
import Employees from './components/employees/Employees.Component';
import PayRoll from './components/payroll/PayRoll.Component';
import Profile from './components/profile/Profile.Component';
import Scheduler from './components/scheduler/Scheduler.Component';
import Services from './components/services/Services.Component';

import { customersQueryKey } from '../hooks/customer.hooks';
import { employeesQueryKey } from '../hooks/employee.hooks';
import { giftCardsQueryKey } from '../hooks/gift-card.hooks';
import { useUserQuery } from '../hooks/profile.hooks';
import { schedulesQueryKey } from '../hooks/schedule.hooks';
import { servicesQueryKey } from '../hooks/service.hooks';

import API_BASE_URL, { authenticatePath } from '../../constants/api.constants';

import { Permissions } from '../../models/enums';
import User from '../../models/User.Model';

import {
	add_customer_event,
	CustomerEventMessage,
	customers_channel,
	delete_customer_event,
	update_customer_event,
} from '../../models/events/customer.events';
import {
	add_employee_event,
	delete_employee_event,
	EmployeeEventMessage,
	employees_channel,
	update_employee_event,
} from '../../models/events/employee.events';
import {
	add_gift_card_event,
	delete_gift_card_event,
	gift_cards_channel,
	update_gift_card_event,
} from '../../models/events/gift-card.events';
import {
	add_reservation_event,
	delete_reservation_event,
	ReservationEventMessage,
	update_reservation_event,
} from '../../models/events/reservation.events';
import {
	add_schedule_event,
	delete_schedule_event,
	ScheduleEventMessage,
	schedules_channel,
	sign_schedule_event,
	update_schedule_event,
} from '../../models/events/schedule.events';
import {
	add_service_event,
	delete_service_event,
	ServiceEventMessage,
	services_channel,
	update_service_event,
} from '../../models/events/service.events';
import {
	add_vip_package_event,
	delete_vip_package_event,
	update_vip_package_event,
	VipPackageEventMessage,
} from '../../models/events/vip-package.events';

import { getLanguageFile } from '../../utils/i18n.utils';
import {
	formatDateToQueryKey,
	formatPhoneNumber,
} from '../../utils/string.utils';
import { pusherToast } from '../../utils/toast.utils';

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
	const [socketId, setSocketId] = useState<string>('');

	const [retryingUserQuery, setRetryingUserQuery] = useState(false);

	const [sideBarItems] = useState([
		SideBarItems.Profile,
		SideBarItems.Scheduler,
		SideBarItems.PayRoll,
	]);

	const [selectedIndex, setSelectedIndex] = useState(1);

	const { i18n, t } = useTranslation();
	const queryClient = useQueryClient();

	const userQuery = useUserQuery({
		gettable: true,
	});
	const user: User = userQuery.data;

	useEffect(() => {
		if (user) {
			i18n.changeLanguage(getLanguageFile(user.language));

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

			const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
				cluster: import.meta.env.VITE_PUSHER_CLUSTER,
				channelAuthorization: {
					endpoint: `${API_BASE_URL}/${authenticatePath}/pusher`,
					transport: 'ajax',
				},
			});

			pusher.connection.bind('connected', () => {
				setSocketId(pusher.connection.socket_id);
			});

			const subscribedChannels: Channel[] = [];

			if (permissions.includes(Permissions.PERMISSION_GET_CUSTOMER)) {
				const channel = pusher.subscribe(customers_channel);

				const onCustomerEvent = (
					customerEventMessage: CustomerEventMessage,
					event: string
				) => {
					const phoneNumber = customerEventMessage.phone_number;
					const vipSerial = customerEventMessage.vip_serial;

					let message: string = '';
					if (event === add_customer_event) {
						message = phoneNumber
							? t('Customer Added Phone Number', {
									phone_number: formatPhoneNumber(phoneNumber),
							  })
							: t('Customer Added VIP Serial', { vip_serial: vipSerial });
					} else if (event === update_customer_event) {
						message = phoneNumber
							? t('Customer Updated Phone Number', {
									phone_number: formatPhoneNumber(phoneNumber),
							  })
							: t('Customer Updated VIP Serial', { vip_serial: vipSerial });
					} else if (event === delete_customer_event) {
						message = phoneNumber
							? t('Customer Deleted Phone Number', {
									phone_number: formatPhoneNumber(phoneNumber),
							  })
							: t('Customer Deleted VIP Serial', { vip_serial: vipSerial });
					}
					pusherToast(message);

					queryClient.invalidateQueries({ queryKey: [customersQueryKey] });
				};

				channel.bind(
					add_customer_event,
					(customerEventMessage: CustomerEventMessage) =>
						onCustomerEvent(customerEventMessage, add_customer_event)
				);
				channel.bind(
					update_customer_event,
					(customerEventMessage: CustomerEventMessage) =>
						onCustomerEvent(customerEventMessage, update_customer_event)
				);
				channel.bind(
					delete_customer_event,
					(customerEventMessage: CustomerEventMessage) =>
						onCustomerEvent(customerEventMessage, delete_customer_event)
				);

				subscribedChannels.push(channel);
			}

			if (permissions.includes(Permissions.PERMISSION_GET_EMPLOYEE)) {
				const channel = pusher.subscribe(employees_channel);

				const onEmployeeEvent = (
					employeeEventMessage: EmployeeEventMessage,
					event: string
				) => {
					const username = employeeEventMessage.username;

					let message: string = '';
					if (event === add_employee_event) {
						message = t('Employee Added', { username });
					} else if (event === update_employee_event) {
						message = t('Employee Updated', { username });
					} else if (event === delete_employee_event) {
						message = t('Employee Deleted', { username });
					}
					pusherToast(message);

					queryClient.invalidateQueries({ queryKey: [employeesQueryKey] });
				};

				channel.bind(
					add_employee_event,
					(employeeEventMessage: EmployeeEventMessage) =>
						onEmployeeEvent(employeeEventMessage, add_employee_event)
				);
				channel.bind(
					update_employee_event,
					(employeeEventMessage: EmployeeEventMessage) =>
						onEmployeeEvent(employeeEventMessage, update_employee_event)
				);
				channel.bind(
					delete_employee_event,
					(employeeEventMessage: EmployeeEventMessage) =>
						onEmployeeEvent(employeeEventMessage, delete_employee_event)
				);

				subscribedChannels.push(channel);
			}

			if (permissions.includes(Permissions.PERMISSION_GET_GIFT_CARD)) {
				const channel = pusher.subscribe(gift_cards_channel);

				const onGiftCardEvent = (_data: any, event: string) => {
					let message: string = '';
					if (event === add_gift_card_event) {
						message = t('Gift Card Added');
					} else if (event === update_gift_card_event) {
						message = t('Gift Card Updated');
					} else if (event === delete_gift_card_event) {
						message = t('Gift Card Deleted');
					}
					pusherToast(message);

					queryClient.invalidateQueries({ queryKey: [giftCardsQueryKey] });
				};

				channel.bind(add_gift_card_event, () =>
					onGiftCardEvent(undefined, add_gift_card_event)
				);
				channel.bind(update_gift_card_event, () =>
					onGiftCardEvent(undefined, update_gift_card_event)
				);
				channel.bind(delete_gift_card_event, () =>
					onGiftCardEvent(undefined, delete_gift_card_event)
				);

				subscribedChannels.push(channel);
			}

			if (permissions.includes(Permissions.PERMISSION_GET_SERVICE)) {
				const channel = pusher.subscribe(services_channel);

				const onServiceEvent = (
					serviceEventMessage: ServiceEventMessage,
					event: string
				) => {
					const serviceName = serviceEventMessage.service_name;

					let message: string = '';
					if (event === add_service_event) {
						message = t('Service Added', { service_name: serviceName });
					} else if (event === update_service_event) {
						message = t('Service Updated', { service_name: serviceName });
					} else if (event === delete_service_event) {
						message = t('Service Deleted', { service_name: serviceName });
					}
					pusherToast(message);

					queryClient.invalidateQueries({ queryKey: [servicesQueryKey] });
				};

				channel.bind(
					add_service_event,
					(serviceEventMessage: ServiceEventMessage) =>
						onServiceEvent(serviceEventMessage, add_service_event)
				);
				channel.bind(
					update_service_event,
					(serviceEventMessage: ServiceEventMessage) =>
						onServiceEvent(serviceEventMessage, update_service_event)
				);
				channel.bind(
					delete_service_event,
					(serviceEventMessage: ServiceEventMessage) =>
						onServiceEvent(serviceEventMessage, delete_service_event)
				);

				subscribedChannels.push(channel);
			}

			const channel = pusher.subscribe(schedules_channel);

			const onReservationEvent = (
				reservationEventMessage: ReservationEventMessage,
				event: string
			) => {
				if (
					permissions.includes(Permissions.PERMISSION_GET_SCHEDULE) ||
					reservationEventMessage.employee_id === user.employee_id
				) {
					const time = reservationEventMessage.time;
					const username = reservationEventMessage.username;
					const createdBy = reservationEventMessage.created_by;

					let message: string = '';
					if (event === add_reservation_event) {
						message = t('Reservation Added', {
							time,
							username,
							created_by: createdBy,
						});
					} else if (event === update_reservation_event) {
						message = t('Reservation Updated', {
							time,
							username,
							updated_by: createdBy,
						});
					} else if (event === delete_reservation_event) {
						message = t('Reservation Deleted', {
							time,
							username,
							deleted_by: createdBy,
						});
					}
					pusherToast(message);

					queryClient.invalidateQueries({
						queryKey: [schedulesQueryKey, formatDateToQueryKey(new Date())],
					});
				}

				if (
					permissions.includes(Permissions.PERMISSION_GET_CUSTOMER) &&
					reservationEventMessage.update_customers
				) {
					queryClient.invalidateQueries({ queryKey: [customersQueryKey] });
				}
			};

			channel.bind(
				add_reservation_event,
				(reservationEventMessage: ReservationEventMessage) =>
					onReservationEvent(reservationEventMessage, add_reservation_event)
			);
			channel.bind(
				update_reservation_event,
				(reservationEventMessage: ReservationEventMessage) =>
					onReservationEvent(reservationEventMessage, update_reservation_event)
			);
			channel.bind(
				delete_reservation_event,
				(reservationEventMessage: ReservationEventMessage) =>
					onReservationEvent(reservationEventMessage, delete_reservation_event)
			);

			const onScheduleEvent = (
				scheduleEventMessage: ScheduleEventMessage,
				event: string
			) => {
				if (
					permissions.includes(Permissions.PERMISSION_GET_SCHEDULE) ||
					scheduleEventMessage.employee_id === user.employee_id
				) {
					const username = scheduleEventMessage.username;

					let message: string = '';
					if (event === add_schedule_event) {
						message = t('Schedule Added', { username });
					} else if (event === update_schedule_event) {
						message = t('Schedule Updated', { username });
					} else if (event === delete_schedule_event) {
						message = t('Schedule Deleted', { username });
					} else if (event === sign_schedule_event) {
						message = t('Schedule Signed', { username });
					}
					pusherToast(message);

					queryClient.invalidateQueries({
						queryKey: [schedulesQueryKey, formatDateToQueryKey(new Date())],
					});
				}
			};

			channel.bind(
				add_schedule_event,
				(scheduleEventMessage: ScheduleEventMessage) =>
					onScheduleEvent(scheduleEventMessage, add_schedule_event)
			);
			channel.bind(
				update_schedule_event,
				(scheduleEventMessage: ScheduleEventMessage) =>
					onScheduleEvent(scheduleEventMessage, update_schedule_event)
			);
			channel.bind(
				delete_schedule_event,
				(scheduleEventMessage: ScheduleEventMessage) =>
					onScheduleEvent(scheduleEventMessage, delete_schedule_event)
			);

			const onVipPackageEvent = (
				vipPackageEventMessage: VipPackageEventMessage,
				event: string
			) => {
				if (
					permissions.includes(Permissions.PERMISSION_GET_SCHEDULE) ||
					vipPackageEventMessage.employee_ids.includes(user.employee_id)
				) {
					const serial = vipPackageEventMessage.serial;

					let message: string = '';
					if (event === add_vip_package_event) {
						message = t('Vip Package Added', { serial });
					} else if (event === update_vip_package_event) {
						message = t('Vip Package Updated', { serial });
					} else if (event === delete_vip_package_event) {
						message = t('Vip Package Deleted', { serial });
					}
					pusherToast(message);

					queryClient.invalidateQueries({
						queryKey: [schedulesQueryKey, formatDateToQueryKey(new Date())],
					});
				}
			};

			channel.bind(
				add_vip_package_event,
				(vipPackageEventMessage: VipPackageEventMessage) =>
					onVipPackageEvent(vipPackageEventMessage, add_vip_package_event)
			);
			channel.bind(
				update_vip_package_event,
				(vipPackageEventMessage: VipPackageEventMessage) =>
					onVipPackageEvent(vipPackageEventMessage, update_vip_package_event)
			);
			channel.bind(
				delete_vip_package_event,
				(vipPackageEventMessage: VipPackageEventMessage) =>
					onVipPackageEvent(vipPackageEventMessage, delete_vip_package_event)
			);

			subscribedChannels.push(channel);

			return () => {
				subscribedChannels.forEach((channel) => {
					channel.unbind_all();
					pusher.unsubscribe(channel.name);
				});
				pusher.disconnect();
			};
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

	return (
		<SocketIdContext.Provider value={{ socketId, setSocketId }}>
			<div className="flex min-h-screen">
				<SideBar
					selectedIndex={selectedIndex}
					onIndexSelected={setSelectedIndex}
					sideBarItems={sideBarItems}
				/>

				<div className="grid landscape:grow landscape:h-screen landscape:ml-[9%] portrait:w-screen portrait:mt-[20%] portrait:sm:mt-[12%]">
					{isLoadingElement}
					<ToastContainer limit={5} />
				</div>
			</div>
		</SocketIdContext.Provider>
	);
};

export default BigFeet;
