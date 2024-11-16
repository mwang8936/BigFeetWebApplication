import { createContext, FC, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { CalendarDaysIcon } from '@heroicons/react/24/outline';

import EditService from './components/EditService.Component.tsx';

import Loading from '../Loading.Component.tsx';
import Retry from '../Retry.Component.tsx';

import PermissionsButton, {
	ButtonType,
} from '../miscallaneous/PermissionsButton.Component.tsx';
import Tabs from '../miscallaneous/Tabs.Component.tsx';

import AddServiceModal from '../miscallaneous/modals/service/AddServiceModal.Component.tsx';
import FilterServicesModal from '../miscallaneous/modals/service/FilterServicesModal.Component.tsx';

import { useServicesQuery } from '../../../hooks/service.hooks.ts';
import { useUserQuery } from '../../../hooks/profile.hooks.ts';

import ERRORS from '../../../../constants/error.constants.ts';

import { Language, Permissions } from '../../../../models/enums.ts';
import { Service } from '../../../../models/Service.Model.ts';
import User from '../../../../models/User.Model.ts';

import { sameDate } from '../../../../utils/date.utils.ts';

const ServiceDateContext = createContext<
	{ date: Date; setDate(date: Date): void } | undefined
>(undefined);

export function useServiceDateContext() {
	const context = useContext(ServiceDateContext);
	if (context === undefined) {
		throw new Error(
			'useServiceDateContext must be within ServiceDateProvider.'
		);
	}

	return context;
}

const ServiceShowDeletedContext = createContext<
	| { showDeleted: boolean; setShowDeleted(showDeleted: boolean): void }
	| undefined
>(undefined);

export function useServiceShowDeletedContext() {
	const context = useContext(ServiceShowDeletedContext);
	if (context === undefined) {
		throw new Error(
			'useServiceShowDeletedContext must be within ServiceShowDeletedProvider.'
		);
	}

	return context;
}

const Services: FC = () => {
	const { t } = useTranslation();

	const [date, setDate] = useState<Date>(() => new Date());
	const [showDeleted, setShowDeleted] = useState(false);

	const [selectedTab, setSelectedTab] = useState(0);

	const [openFilterModal, setOpenFilterModal] = useState<boolean>(false);
	const [openAddModal, setOpenAddModal] = useState<boolean>(false);

	const [retryingServiceQuery, setRetryingServiceQuery] =
		useState<boolean>(false);

	const userQuery = useUserQuery({ gettable: true, staleTime: Infinity });
	const user: User = userQuery.data;

	const gettable = user.permissions.includes(
		Permissions.PERMISSION_GET_SERVICE
	);
	const creatable = user.permissions.includes(
		Permissions.PERMISSION_ADD_SERVICE
	);

	const language = user.language;

	const isToday = sameDate(date, new Date());

	const serviceQuery = useServicesQuery({ gettable, withDeleted: showDeleted });

	const services: Service[] = serviceQuery.data || [];

	const isServiceLoading = serviceQuery.isLoading;

	const retryServiceQuery = serviceQuery.refetch;
	const isServiceError = serviceQuery.isError;
	const serviceError = serviceQuery.error;

	const isServicePaused = serviceQuery.isPaused;

	useEffect(() => {
		retryServiceQuery();
	}, [showDeleted, retryServiceQuery]);

	let tabs: { text: string; deleted: boolean }[] = [];
	if (!isServiceLoading && !isServiceError && !isServicePaused && services) {
		tabs = services.map((service) => ({
			text: service.service_name,
			deleted: service.deleted_at != undefined,
		}));
	}

	let service = services[selectedTab];

	if (services.length > 0 && !service) {
		setSelectedTab(0);
		service = services[selectedTab];
	}

	const servicesElement =
		services.length !== 0 ? (
			<>{service && <EditService service={service} />}</>
		) : (
			<h1 className="large-centered-text">{t('No Services Created')}</h1>
		);

	const tabsElement = (
		<>
			<Tabs
				tabs={tabs}
				selectedTab={selectedTab}
				onTabSelected={setSelectedTab}
			/>

			<div className="content-div">{servicesElement}</div>
		</>
	);

	const pausedElement = isServicePaused ? (
		<Retry
			retrying={retryingServiceQuery}
			error={'Network Connection Issue'}
			onRetry={() => {}}
			enabled={false}
		/>
	) : (
		tabsElement
	);

	const errorsElement = isServiceError ? (
		<Retry
			retrying={retryingServiceQuery}
			error={serviceError?.message ?? ''}
			onRetry={() => {
				setRetryingServiceQuery(true);
				retryServiceQuery().finally(() => setRetryingServiceQuery(false));
			}}
			enabled={gettable}
		/>
	) : (
		pausedElement
	);

	const permissionsElement = !gettable ? (
		<h1 className="large-centered-text">{t(ERRORS.service.permissions.get)}</h1>
	) : (
		errorsElement
	);

	const isLoadingElement = isServiceLoading ? <Loading /> : permissionsElement;

	const displayDate = () => {
		const localeDateFormat =
			language === Language.SIMPLIFIED_CHINESE
				? 'zh-CN'
				: user.language === Language.TRADITIONAL_CHINESE
				? 'zh-TW'
				: undefined;

		const dateString = date.toLocaleDateString(localeDateFormat, {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			weekday: 'short',
		});

		return isToday ? `${t('Today')} - ${dateString}` : dateString;
	};

	return (
		<ServiceDateContext.Provider value={{ date, setDate }}>
			<ServiceShowDeletedContext.Provider
				value={{ showDeleted, setShowDeleted }}>
				<div className="non-sidebar overflow-x-hidden">
					<div className="title-bar">
						<div className="vertical-center">
							<PermissionsButton
								btnTitle={'Add Service'}
								btnType={ButtonType.ADD}
								top={false}
								disabled={!creatable}
								missingPermissionMessage={ERRORS.service.permissions.add}
								onClick={() => setOpenAddModal(true)}
							/>
						</div>

						<div className="vertical-center flex flex-col">
							<h1 className="my-auto mx-auto text-gray-600 text-3xl">
								{t('Services')}
							</h1>

							<h1 className="mx-auto text-gray-600 text-xl">{displayDate()}</h1>
						</div>

						<div className="vertical-center ms-10 flex flex-row ">
							<CalendarDaysIcon
								className={`h-16 w-16 ${
									isToday && !showDeleted
										? 'text-gray-600 hover:text-gray-400'
										: 'text-blue-600 hover:text-blue-400'
								} my-auto me-10 cursor-pointer transition-colors duration-200 hover:scale-110`}
								onClick={() => setOpenFilterModal(true)}
							/>
						</div>
					</div>

					{isLoadingElement}
				</div>

				<FilterServicesModal
					open={openFilterModal}
					setOpen={setOpenFilterModal}
				/>

				<AddServiceModal open={openAddModal} setOpen={setOpenAddModal} />
			</ServiceShowDeletedContext.Provider>
		</ServiceDateContext.Provider>
	);
};

export default Services;
