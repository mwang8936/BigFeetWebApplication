import { FC, useState } from 'react';
import { useEmployeesContext, useUserContext } from '../../BigFeet.Page';
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
	createToast,
	errorToast,
	updateToast,
} from '../../../../utils/toast.utils';

const Employees: FC = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [selectedTab, setSelectedTab] = useState(0);

	const [openAddModal, setOpenAddModal] = useState<boolean>(false);

	const { employees, setEmployees } = useEmployeesContext();
	const { user } = useUserContext();

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

	const tabs = employees.map((employee) => employee.username);

	const onAdd = async (addEmployeeRequest: AddEmployeeRequest) => {
		const toastId = createToast(t('Adding Employee...'));
		addEmployee(navigate, addEmployeeRequest)
			.then((response) => {
				if (gettable) {
					setEmployees([...employees, response]);
				} else {
					setEmployees([]);
				}
				updateToast(toastId, t('Employee Added Successfully'));
			})
			.catch((error) => {
				errorToast(toastId, t('Failed to Add Employee'), error.message);
			});
	};

	const employeesElement =
		employees.length !== 0 ? (
			<>
				{employees[selectedTab] && (
					<EditEmployee
						gettable={gettable}
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

	const permissionsElement = gettable ? (
		employeesElement
	) : (
		<h1 className="m-auto text-gray-600 text-3xl">
			{t('Missing Get Employees Perissions')}
		</h1>
	);

	return (
		<div className="w-11/12 mx-auto h-full flex-col">
			<div className="h-28 bg-blue border-b-2 border-gray-400 flex flex-row justify-between">
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
			<Tabs
				tabs={tabs}
				selectedTab={selectedTab}
				onTabSelected={setSelectedTab}
			/>
			<AddEmployeeModal
				open={openAddModal}
				setOpen={setOpenAddModal}
				creatable={creatable}
				onAddEmployee={onAdd}
			/>
			<div className="mt-8 mb-4">{permissionsElement}</div>
		</div>
	);
};

export default Employees;
