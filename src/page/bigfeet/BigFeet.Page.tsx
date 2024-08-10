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

import Customer from '../../models/Customer.Model';
import Employee from '../../models/Employee.Model';
import GiftCard from '../../models/Gift-Card.Model';
import { Permissions } from '../../models/enums';
import Reservation from '../../models/Reservation.Model';
import Schedule from '../../models/Schedule.Model';
import Service from '../../models/Service.Model';
import User from '../../models/User.Model';
import VipPackage from '../../models/Vip-Package.Model';

import {
	add_customer_event,
	customers_channel,
	delete_customer_event,
	update_customer_event,
} from '../../models/events/customer.events';
import {
	add_employee_event,
	delete_employee_event,
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
	update_reservation_event,
} from '../../models/events/reservation.events';
import {
	add_schedule_event,
	delete_schedule_event,
	schedules_channel,
	update_schedule_event,
} from '../../models/events/schedule.events';
import {
	add_service_event,
	delete_service_event,
	services_channel,
	update_service_event,
} from '../../models/events/service.events';
import {
	add_vip_package_event,
	delete_vip_package_event,
	update_vip_package_event,
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

	const [sideBarItems] = useState([SideBarItems.Profile]);

	const [selectedIndex, setSelectedIndex] = useState(0);

	const { i18n, t } = useTranslation();
	const queryClient = useQueryClient();

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

				const onCustomerEvent = (customer: Customer, event: string) => {
					const phoneNumber = customer.phone_number;
					const vipSerial = customer.vip_serial;

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

				channel.bind(add_customer_event, (customer: Customer) =>
					onCustomerEvent(customer, add_customer_event)
				);
				channel.bind(update_customer_event, (customer: Customer) =>
					onCustomerEvent(customer, update_customer_event)
				);
				channel.bind(delete_customer_event, (customer: Customer) =>
					onCustomerEvent(customer, delete_customer_event)
				);

				subscribedChannels.push(channel);
			}

			if (permissions.includes(Permissions.PERMISSION_GET_EMPLOYEE)) {
				const channel = pusher.subscribe(employees_channel);

				const onEmployeeEvent = (employee: Employee, event: string) => {
					const username = employee.username;

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

				channel.bind(add_employee_event, (employee: Employee) =>
					onEmployeeEvent(employee, add_employee_event)
				);
				channel.bind(update_employee_event, (employee: Employee) =>
					onEmployeeEvent(employee, update_employee_event)
				);
				channel.bind(delete_employee_event, (employee: Employee) =>
					onEmployeeEvent(employee, delete_employee_event)
				);

				subscribedChannels.push(channel);
			}

			if (permissions.includes(Permissions.PERMISSION_GET_GIFT_CARD)) {
				const channel = pusher.subscribe(gift_cards_channel);

				const onGiftCardEvent = (_giftCard: GiftCard, event: string) => {
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

				channel.bind(add_gift_card_event, (giftCard: GiftCard) =>
					onGiftCardEvent(giftCard, add_gift_card_event)
				);
				channel.bind(update_gift_card_event, (giftCard: GiftCard) =>
					onGiftCardEvent(giftCard, update_gift_card_event)
				);
				channel.bind(delete_gift_card_event, (giftCard: GiftCard) =>
					onGiftCardEvent(giftCard, delete_gift_card_event)
				);

				subscribedChannels.push(channel);
			}

			if (permissions.includes(Permissions.PERMISSION_GET_SERVICE)) {
				const channel = pusher.subscribe(services_channel);

				const onServiceEvent = (service: Service, event: string) => {
					const serviceName = service.service_name;

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

				channel.bind(add_service_event, (service: Service) =>
					onServiceEvent(service, add_service_event)
				);
				channel.bind(update_service_event, (service: Service) =>
					onServiceEvent(service, update_service_event)
				);
				channel.bind(delete_service_event, (service: Service) =>
					onServiceEvent(service, delete_service_event)
				);

				subscribedChannels.push(channel);
			}

			const channel = pusher.subscribe(schedules_channel);

			const onReservationEvent = (reservation: Reservation, event: string) => {
				const reservedDate = new Date(reservation.reserved_date);
				const time = reservedDate.toLocaleTimeString('en-US', {
					timeZone: 'America/Los_Angeles',
					hour12: true,
					hour: '2-digit',
					minute: '2-digit',
				});

				let message: string = '';
				if (event === add_reservation_event) {
					message = t('Reservation Added', { time });
				} else if (event === update_reservation_event) {
					message = t('Reservation Updated', { time });
				} else if (event === delete_reservation_event) {
					message = t('Reservation Deleted', { time });
				}
				pusherToast(message);

				if (
					permissions.includes(Permissions.PERMISSION_GET_SCHEDULE) ||
					reservation.employee_id === user.employee_id
				) {
					queryClient.invalidateQueries({
						queryKey: [schedulesQueryKey, formatDateToQueryKey(new Date())],
					});
				}

				if (
					permissions.includes(Permissions.PERMISSION_GET_CUSTOMER) &&
					(reservation.customer?.phone_number ||
						reservation.customer?.customer_name ||
						reservation.customer?.notes)
				) {
					queryClient.invalidateQueries({ queryKey: [customersQueryKey] });
				}
			};

			channel.bind(add_reservation_event, (reservation: Reservation) =>
				onReservationEvent(reservation, add_reservation_event)
			);
			channel.bind(update_reservation_event, (reservation: Reservation) =>
				onReservationEvent(reservation, update_reservation_event)
			);
			channel.bind(delete_reservation_event, (reservation: Reservation) =>
				onReservationEvent(reservation, delete_reservation_event)
			);

			const onScheduleEvent = (schedule: Schedule, event: string) => {
				const username = schedule.employee.username;

				let message: string = '';
				if (event === add_schedule_event) {
					message = t('Schedule Added', { username });
				} else if (event === update_schedule_event) {
					message = t('Schedule Updated', { username });
				} else if (event === delete_schedule_event) {
					message = t('Schedule Deleted', { username });
				}
				pusherToast(message);

				if (
					permissions.includes(Permissions.PERMISSION_GET_SCHEDULE) ||
					schedule.employee.employee_id === user.employee_id
				) {
					queryClient.invalidateQueries({
						queryKey: [schedulesQueryKey, formatDateToQueryKey(new Date())],
					});
				}
			};

			channel.bind(add_schedule_event, (schedule: Schedule) =>
				onScheduleEvent(schedule, add_schedule_event)
			);
			channel.bind(update_schedule_event, (schedule: Schedule) =>
				onScheduleEvent(schedule, update_schedule_event)
			);
			channel.bind(delete_schedule_event, (schedule: Schedule) =>
				onScheduleEvent(schedule, delete_schedule_event)
			);

			const onVipPackageEvent = (vipPackage: VipPackage, event: string) => {
				const serial = vipPackage.serial;

				let message: string = '';
				if (event === add_vip_package_event) {
					message = t('Vip Package Added', { serial });
				} else if (event === update_vip_package_event) {
					message = t('Vip Package Updated', { serial });
				} else if (event === delete_vip_package_event) {
					message = t('Vip Package Deleted', { serial });
				}
				pusherToast(message);

				if (
					permissions.includes(Permissions.PERMISSION_GET_SCHEDULE) ||
					vipPackage.employee_ids.includes(user.employee_id)
				) {
					queryClient.invalidateQueries({
						queryKey: [schedulesQueryKey, formatDateToQueryKey(new Date())],
					});
				}
			};

			channel.bind(add_vip_package_event, (vipPackage: VipPackage) =>
				onVipPackageEvent(vipPackage, add_vip_package_event)
			);
			channel.bind(update_vip_package_event, (vipPackage: VipPackage) =>
				onVipPackageEvent(vipPackage, update_vip_package_event)
			);
			channel.bind(delete_vip_package_event, (vipPackage: VipPackage) =>
				onVipPackageEvent(vipPackage, delete_vip_package_event)
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
