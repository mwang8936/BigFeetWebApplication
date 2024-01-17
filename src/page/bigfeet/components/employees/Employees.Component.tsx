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
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const Employees: FC = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [selectedTab, setSelectedTab] = useState(0);

	const [openAddModal, setOpenAddModal] = useState<boolean>(false);

	const { employees, setEmployees } = useEmployeesContext();
	const { user } = useUserContext();

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
		const toastId = toast.loading(t('Adding Employee...'));
		addEmployee(navigate, addEmployeeRequest)
			.then((response) => {
				setEmployees([...employees, response]);
				toast.update(toastId, {
					render: t('Employee Added Successfully'),
					type: 'success',
					isLoading: false,
					position: 'top-right',
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					pauseOnFocusLoss: true,
					draggable: true,
					theme: 'light',
				});
			})
			.catch((error) => {
				toast.update(toastId, {
					render: (
						<h1>
							{t('Failed to Add Employee')} <br />
							{error.message}
						</h1>
					),
					type: 'error',
					isLoading: false,
					position: 'top-right',
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					pauseOnFocusLoss: true,
					draggable: true,
					theme: 'light',
				});
			});
	};

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
			<div className="mt-8 mb-4">
				{employees.length <= 0 ? (
					<h1 className="m-auto text-gray-600 text-3xl">
						{t('No Employees Created')}
					</h1>
				) : (
					<>
						{employees[selectedTab] && (
							<EditEmployee
								editable={editable}
								deletable={deletable}
								employee={employees[selectedTab]}
							/>
						)}
					</>
				)}
			</div>
		</div>
	);
};

export default Employees;
