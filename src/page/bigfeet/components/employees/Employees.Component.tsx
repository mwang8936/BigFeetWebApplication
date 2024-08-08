import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import EditEmployee from './components/EditEmployee.Component';

import Loading from '../Loading.Component';
import Retry from '../Retry.Component';

import PermissionsButton, {
	ButtonType,
} from '../miscallaneous/PermissionsButton.Component';
import Tabs from '../miscallaneous/Tabs.Component';

import AddEmployeeModal from '../miscallaneous/modals/employee/AddEmployeeModal.Component';

import {
	useEmployeesQuery,
	useAddEmployeeMutation,
} from '../../../hooks/employee.hooks';
import { useUserQuery } from '../../../hooks/profile.hooks';

import ERRORS from '../../../../constants/error.constants';

import Employee from '../../../../models/Employee.Model';
import { Permissions } from '../../../../models/enums';
import User from '../../../../models/User.Model';

import { AddEmployeeRequest } from '../../../../models/requests/Employee.Request.Model';

const Employees: FC = () => {
	const { t } = useTranslation();

	const [selectedTab, setSelectedTab] = useState(0);

	const [openAddModal, setOpenAddModal] = useState<boolean>(false);

	const [retryingEmployeeQuery, setRetryingEmployeeQuery] =
		useState<boolean>(false);

	const userQuery = useUserQuery({ gettable: true, staleTime: Infinity });
	const user: User = userQuery.data;

	const gettable = user.permissions.includes(
		Permissions.PERMISSION_GET_EMPLOYEE
	);
	const creatable = user.permissions.includes(
		Permissions.PERMISSION_ADD_EMPLOYEE
	);
	const editable = user.permissions.includes(
		Permissions.PERMISSION_UPDATE_EMPLOYEE
	);
	const deletable = user.permissions.includes(
		Permissions.PERMISSION_DELETE_EMPLOYEE
	);

	const employeeQuery = useEmployeesQuery({ gettable });

	const employees: Employee[] = employeeQuery.data || [user];

	const isEmployeeLoading = employeeQuery.isLoading;

	const retryEmployeeQuery = employeeQuery.refetch;
	const isEmployeeError = employeeQuery.isError;
	const employeeError = employeeQuery.error;

	const isEmployeePaused = employeeQuery.isPaused;

	let tabs: string[] = [];
	if (
		!isEmployeeLoading &&
		!isEmployeeError &&
		!isEmployeePaused &&
		employees
	) {
		tabs = employees.map((employee) => employee.username);
	}

	const addEmployeeMutation = useAddEmployeeMutation({});

	const onAdd = async (request: AddEmployeeRequest) => {
		addEmployeeMutation.mutate({ request });
	};

	const employeesElement =
		employees.length !== 0 ? (
			<>
				{employees[selectedTab] && (
					<EditEmployee
						editable={editable}
						deletable={deletable}
						employee={employees[selectedTab]}
					/>
				)}
			</>
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

			<div className="content-div">{employeesElement}</div>
		</>
	);

	const pausedElement = isEmployeePaused ? (
		<Retry
			retrying={retryingEmployeeQuery}
			error={'Network Connection Issue'}
			onRetry={() => {}}
			enabled={false}
		/>
	) : (
		tabsElement
	);

	const errorsElement = isEmployeeError ? (
		<Retry
			retrying={retryingEmployeeQuery}
			error={employeeError?.message ?? ''}
			onRetry={() => {
				setRetryingEmployeeQuery(true);
				retryEmployeeQuery().finally(() => setRetryingEmployeeQuery(false));
			}}
			enabled={gettable}
		/>
	) : (
		pausedElement
	);

	const permissionsElement = !gettable ? (
		<h1 className="large-centered-text">
			{t(ERRORS.employee.permissions.get)}
		</h1>
	) : (
		errorsElement
	);

	const isLoadingElement = isEmployeeLoading ? <Loading /> : permissionsElement;

	return (
		<>
			<div className="non-sidebar">
				<div className="title-bar">
					<h1 className="centered-title-text">{t('Employees')}</h1>

					<div className="vertical-center">
						<PermissionsButton
							btnTitle={t('Add Employee')}
							btnType={ButtonType.ADD}
							top={false}
							disabled={!creatable}
							missingPermissionMessage={ERRORS.employee.permissions.add}
							onClick={() => {
								setOpenAddModal(true);
							}}
						/>
					</div>
				</div>

				{isLoadingElement}
			</div>

			<AddEmployeeModal
				open={openAddModal}
				setOpen={setOpenAddModal}
				creatable={creatable}
				onAddEmployee={onAdd}
			/>
		</>
	);
};

export default Employees;
