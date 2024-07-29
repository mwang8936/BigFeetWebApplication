import { FC, useState } from 'react';
import { Permissions } from '../../../../models/enums';
import { addEmployee } from '../../../../service/employee.service';
import Tabs from '../miscallaneous/Tabs.Component';
import EditEmployee from './components/EditEmployee.Component';
import { useNavigate } from 'react-router-dom';
import PermissionsButton, {
	ButtonType,
} from '../miscallaneous/PermissionsButton.Component';
import ERRORS from '../../../../constants/error.constants';
import AddEmployeeModal from '../miscallaneous/modals/employee/AddEmployeeModal.Component';
import { AddEmployeeRequest } from '../../../../models/requests/Employee.Request.Model';
import { useTranslation } from 'react-i18next';
import {
	createLoadingToast,
	errorToast,
	successToast,
} from '../../../../utils/toast.utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Loading from '../Loading.Component';
import Retry from '../Retry.Component';
import Employee from '../../../../models/Employee.Model';
import {
	useEmployeesQuery,
	useUserQuery,
} from '../../../../service/query/get-items.query';
import User from '../../../../models/User.Model';

const Employees: FC = () => {
	const { t } = useTranslation();
	const queryClient = useQueryClient();
	const navigate = useNavigate();

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

	const employees: Employee[] = employeeQuery.data || [];

	const isEmployeeLoading = employeeQuery.isLoading;

	const retryEmployeeQuery = employeeQuery.refetch;
	const isEmployeeError = employeeQuery.isError;
	const employeeError = employeeQuery.error;

	const isEmployeePaused = employeeQuery.isPaused;

	let tabs: string[] = [];
	if (!isEmployeeLoading && !isEmployeeError && !isEmployeePaused) {
		tabs = employees.map((employee) => employee.username);
	}

	const addEmployeeMutation = useMutation({
		mutationFn: (data: { request: AddEmployeeRequest }) =>
			addEmployee(navigate, data.request),
		onMutate: async () => {
			const toastId = createLoadingToast(t('Adding Employee...'));
			return { toastId };
		},
		onSuccess: (_data, _variables, context) => {
			queryClient.invalidateQueries({ queryKey: ['employees'] });
			successToast(context.toastId, t('Employee Added Successfully'));
		},
		onError: (error, _variables, context) => {
			if (context)
				errorToast(context.toastId, t('Failed to Add Employee'), error.message);
		},
	});

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
			<h1 className="m-auto text-gray-600 text-3xl">
				{t('No Employees Created')}
			</h1>
		);

	const tabsElement = (
		<>
			<Tabs
				tabs={tabs}
				selectedTab={selectedTab}
				onTabSelected={setSelectedTab}
			/>
			<div className="mt-8 mb-4 pr-4 overflow-auto">{employeesElement}</div>
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
			error={employeeError?.message as string}
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
		<h1 className="m-auto text-gray-600 text-3xl">
			{t(ERRORS.employee.permissions.get)}
		</h1>
	) : (
		errorsElement
	);

	const isLoadingElement = isEmployeeLoading ? <Loading /> : permissionsElement;

	return (
		<>
			<div className="non-sidebar">
				<div className="py-4 h-28 bg-blue border-b-2 border-gray-400 flex flex-row justify-between">
					<h1 className="my-auto text-gray-600 text-3xl">{t('Employees')}</h1>
					<div className="h-fit my-auto flex">
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
