import { FC, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog } from '@headlessui/react';

import { PencilSquareIcon } from '@heroicons/react/24/outline';

import EditBottom from '../EditBottom.Component';

import AddInput from '../../add/AddInput.Component';
import AddPassword from '../../add/AddPassword.Component';

import {
	useChangeProfilePasswordMutation,
	useUserQuery,
} from '../../../../../hooks/profile.hooks';

import ERRORS from '../../../../../../constants/error.constants';
import LABELS from '../../../../../../constants/label.constants';
import LENGTHS from '../../../../../../constants/lengths.constants';
import NAMES from '../../../../../../constants/name.constants';
import PATTERNS from '../../../../../../constants/patterns.constants';
import PLACEHOLDERS from '../../../../../../constants/placeholder.constants';

import User from '../../../../../../models/User.Model';

import { ChangeProfilePasswordRequest } from '../../../../../../models/requests/Profile.Request.Model';

interface ChangeProfilePasswordProp {
	setOpen(open: boolean): void;
}

const ChangeProfilePassword: FC<ChangeProfilePasswordProp> = ({ setOpen }) => {
	const { t } = useTranslation();

	const [oldPasswordInput, setOldPasswordInput] = useState<string | null>(null);
	const [newPasswordInput, setNewPasswordInput] = useState<string | null>(null);

	const [invalidOldPassword, setInvalidOldPassword] = useState<boolean>(false);
	const [invalidNewPassword, setInvalidNewPassword] = useState<boolean>(false);
	const [matchingPassword, setMatchingPassword] = useState<boolean>(true);

	const [missingRequiredInput, setMissingRequiredInput] =
		useState<boolean>(false);
	const [invalidInput, setInvalidInput] = useState<boolean>(false);

	const userQuery = useUserQuery({ gettable: true, staleTime: Infinity });
	const user: User = userQuery.data;

	const username = user.username;

	useEffect(() => {
		const missingRequiredInput =
			oldPasswordInput === null || newPasswordInput === null;

		setMissingRequiredInput(missingRequiredInput);
	}, [oldPasswordInput, newPasswordInput]);

	useEffect(() => {
		const invalidInput =
			invalidOldPassword || invalidNewPassword || !matchingPassword;

		setInvalidInput(invalidInput);
	}, [invalidOldPassword, invalidNewPassword, matchingPassword]);

	const changeProfilePasswordMutation = useChangeProfilePasswordMutation({
		onSuccess: () => setOpen(false),
	});
	const onChangeProfilePassword = async (
		request: ChangeProfilePasswordRequest
	) => {
		changeProfilePasswordMutation.mutate({ request });
	};

	const onEdit = () => {
		const old_password = (oldPasswordInput as string).trim();
		const new_password = (newPasswordInput as string).trim();

		const changeProfilePasswordRequest: ChangeProfilePasswordRequest = {
			old_password,
			new_password,
		};

		onChangeProfilePassword(changeProfilePasswordRequest);
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
							{t('Change Password Title', { username })}
						</Dialog.Title>

						<div className="mt-2">
							{t('Change Password Message')}

							<div className="mt-2">
								<AddInput
									text={oldPasswordInput}
									setText={setOldPasswordInput}
									label={LABELS.profile.old_password}
									name={NAMES.profile.old_password}
									type="password"
									validationProp={{
										pattern: PATTERNS.employee.password,
										maxLength: LENGTHS.employee.password,
										required: true,
										requiredMessage: ERRORS.profile.old_password.required,
										invalid: invalidOldPassword,
										setInvalid: setInvalidOldPassword,
										invalidMessage: ERRORS.profile.old_password.invalid,
									}}
									placeholder={PLACEHOLDERS.employee.password}
								/>

								<div className="mt-8">
									<AddPassword
										password={newPasswordInput}
										setPassword={setNewPasswordInput}
										label={LABELS.profile.new_password}
										name={NAMES.profile.new_password}
										retypeLabel={LABELS.profile.retype_new_password}
										retypeName={NAMES.profile.retype_new_password}
										validationProp={{
											required: true,
											requiredMessage: ERRORS.profile.new_password.required,
											invalid: invalidNewPassword,
											setInvalid: setInvalidNewPassword,
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

export default ChangeProfilePassword;
