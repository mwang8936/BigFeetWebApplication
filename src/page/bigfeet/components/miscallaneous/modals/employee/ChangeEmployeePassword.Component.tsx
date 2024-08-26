import { FC, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog } from '@headlessui/react';

import { PencilSquareIcon } from '@heroicons/react/24/outline';

import EditBottom from '../EditBottom.Component';

import AddPassword from '../../add/AddPassword.Component';

import { useUpdateEmployeeMutation } from '../../../../../hooks/employee.hooks';
import { useUserQuery } from '../../../../../hooks/profile.hooks';

import ERRORS from '../../../../../../constants/error.constants';
import LABELS from '../../../../../../constants/label.constants';
import NAMES from '../../../../../../constants/name.constants';

import Employee from '../../../../../../models/Employee.Model';
import User from '../../../../../../models/User.Model';

import { UpdateEmployeeRequest } from '../../../../../../models/requests/Employee.Request.Model';

interface ChangeEmployeePasswordProp {
	setOpen(open: boolean): void;
	employee: Employee;
}

const ChangeEmployeePassword: FC<ChangeEmployeePasswordProp> = ({
	setOpen,
	employee,
}) => {
	const { t } = useTranslation();

	const [passwordInput, setPasswordInput] = useState<string | null>(null);

	const [invalidPassword, setInvalidPassword] = useState<boolean>(false);
	const [matchingPassword, setMatchingPassword] = useState<boolean>(true);

	const [missingRequiredInput, setMissingRequiredInput] =
		useState<boolean>(false);
	const [invalidInput, setInvalidInput] = useState<boolean>(false);

	const userQuery = useUserQuery({ gettable: true, staleTime: Infinity });
	const user: User = userQuery.data;

	useEffect(() => {
		const missingRequiredInput = passwordInput === null;

		setMissingRequiredInput(missingRequiredInput);
	}, [passwordInput]);

	useEffect(() => {
		const invalidInput = invalidPassword || !matchingPassword;

		setInvalidInput(invalidInput);
	}, [invalidPassword, matchingPassword]);

	const updateEmployeeMutation = useUpdateEmployeeMutation({
		onSuccess: () => setOpen(false),
	});
	const updateEmployee = async (
		employeeId: number,
		request: UpdateEmployeeRequest
	) => {
		const userId = user.employee_id;

		updateEmployeeMutation.mutate({ employeeId, request, userId });
	};

	const onEdit = () => {
		const password = (passwordInput as string).trim();

		const updateEmployeeRequest: UpdateEmployeeRequest = {
			password,
		};

		updateEmployee(employee.employee_id, updateEmployeeRequest);
	};

	return (
		<>
			<div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
				<div className="sm:flex sm:items-start">
					<div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
						<PencilSquareIcon
							className="h-6 w-6 text-blue-600"
							aria-hidden="true"
						/>
					</div>

					<div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
						<Dialog.Title
							as="h3"
							className="text-base font-semibold leading-6 text-gray-900">
							{t('Change Password Title', { username: employee.username })}
						</Dialog.Title>

						<div className="mt-2">
							{t('Change Password Message')}

							<div className="mt-2">
								<AddPassword
									password={passwordInput}
									setPassword={setPasswordInput}
									label={LABELS.profile.new_password}
									name={NAMES.profile.new_password}
									retypeLabel={LABELS.profile.retype_new_password}
									retypeName={NAMES.profile.retype_new_password}
									validationProp={{
										required: true,
										requiredMessage: ERRORS.profile.new_password.required,
										invalid: invalidPassword,
										setInvalid: setInvalidPassword,
										invalidMessage: ERRORS.profile.new_password.invalid,
										matching: matchingPassword,
										setMatching: setMatchingPassword,
									}}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>

			<EditBottom
				onCancel={() => setOpen(false)}
				disabledEdit={missingRequiredInput || invalidInput}
				editMissingPermissionMessage={
					missingRequiredInput
						? ERRORS.required
						: invalidInput
						? ERRORS.invalid
						: ''
				}
				onEdit={onEdit}
			/>
		</>
	);
};

export default ChangeEmployeePassword;
