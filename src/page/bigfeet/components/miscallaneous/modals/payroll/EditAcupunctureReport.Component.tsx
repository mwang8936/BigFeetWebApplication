import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog } from '@headlessui/react';

import { PencilSquareIcon } from '@heroicons/react/24/outline';

import EditBottom from '../EditBottom.Component';

import EditablePercentage from '../../editable/EditablePercentage.Component';

import { usePayrollDateContext } from '../../../payroll/PayRoll.Component';

import { useUpdateAcupunctureReportMutation } from '../../../../../hooks/acupuncture-report.hooks';
import { useUserQuery } from '../../../../../hooks/profile.hooks';

import ERRORS from '../../../../../../constants/error.constants';
import LABELS from '../../../../../../constants/label.constants';
import NAMES from '../../../../../../constants/name.constants';
import NUMBERS from '../../../../../../constants/numbers.constants';
import PLACEHOLDERS from '../../../../../../constants/placeholder.constants';

import AcupunctureReport from '../../../../../../models/Acupuncture-Report.Model';
import { Language, Permissions } from '../../../../../../models/enums';
import User from '../../../../../../models/User.Model';

import { UpdateAcupunctureReportRequest } from '../../../../../../models/requests/Acupuncture-Report.Request.Model';

import { getYearMonthString } from '../../../../../../utils/date.utils';

interface EditAcupunctureProp {
	setOpen(open: boolean): void;
	acupunctureReport: AcupunctureReport;
}

const EditAcupunctureReport: FC<EditAcupunctureProp> = ({
	setOpen,
	acupunctureReport,
}) => {
	const { t } = useTranslation();

	const { date } = usePayrollDateContext();

	const [acupuncturePercentageInput, setAcupuncturePercentageInput] = useState<
		number | null
	>(acupunctureReport.acupuncture_percentage);
	const [massagePercentageInput, setMassagePercentageInput] = useState<
		number | null
	>(acupunctureReport.massage_percentage);
	const [insurancePercentageInput, setInsurancePercentageInput] = useState<
		number | null
	>(acupunctureReport.insurance_percentage);
	const [
		nonAcupuncturistInsurancePercentageInput,
		setNonAcupuncturistInsurancePercentageInput,
	] = useState<number | null>(
		acupunctureReport.non_acupuncturist_insurance_percentage
	);

	const [invalidAcupuncturePercentage, setInvalidAcupuncturePercentage] =
		useState<boolean>(false);
	const [invalidMassagePercentage, setInvalidMassagePercentage] =
		useState<boolean>(false);
	const [invalidInsurancePercentage, setInvalidInsurancePercentage] =
		useState<boolean>(false);
	const [
		invalidNonAcupuncturistInsurancePercentage,
		setInvalidNonAcupuncturistInsurancePercentage,
	] = useState<boolean>(false);

	const [changesMade, setChangesMade] = useState<boolean>(false);
	const [missingRequiredInput, setMissingRequiredInput] =
		useState<boolean>(true);
	const [invalidInput, setInvalidInput] = useState<boolean>(false);

	const userQuery = useUserQuery({ gettable: true, staleTime: Infinity });
	const user: User = userQuery.data;

	const language = user.language;

	const editable = user.permissions.includes(
		Permissions.PERMISSION_UPDATE_PAYROLL
	);

	useEffect(() => {
		const acupuncture_percentage: number | null | undefined =
			acupuncturePercentageInput === acupunctureReport.acupuncture_percentage
				? undefined
				: acupuncturePercentageInput;
		const massage_percentage: number | null | undefined =
			massagePercentageInput === acupunctureReport.massage_percentage
				? undefined
				: massagePercentageInput;
		const insurance_percentage: number | null | undefined =
			insurancePercentageInput === acupunctureReport.insurance_percentage
				? undefined
				: insurancePercentageInput;
		const non_acupuncturist_insurance_percentage: number | null | undefined =
			nonAcupuncturistInsurancePercentageInput ===
			acupunctureReport.non_acupuncturist_insurance_percentage
				? undefined
				: nonAcupuncturistInsurancePercentageInput;

		const changesMade =
			acupuncture_percentage !== undefined ||
			massage_percentage !== undefined ||
			insurance_percentage !== undefined ||
			non_acupuncturist_insurance_percentage !== undefined;

		setChangesMade(changesMade);

		const missingRequiredInput =
			acupuncturePercentageInput === null ||
			massagePercentageInput === null ||
			insurancePercentageInput === null ||
			nonAcupuncturistInsurancePercentageInput === null;

		setMissingRequiredInput(missingRequiredInput);
	}, [
		acupuncturePercentageInput,
		massagePercentageInput,
		insurancePercentageInput,
		nonAcupuncturistInsurancePercentageInput,
	]);

	useEffect(() => {
		const invalidInput =
			invalidAcupuncturePercentage ||
			invalidMassagePercentage ||
			invalidInsurancePercentage ||
			invalidNonAcupuncturistInsurancePercentage;

		setInvalidInput(invalidInput);
	}, [
		invalidAcupuncturePercentage,
		invalidMassagePercentage,
		invalidInsurancePercentage,
		invalidNonAcupuncturistInsurancePercentage,
	]);

	const updateAcupunctureReportMutation = useUpdateAcupunctureReportMutation({
		onSuccess: () => setOpen(false),
	});
	const onEditAcupunctureReport = async (
		year: number,
		month: number,
		employeeId: number,
		request: UpdateAcupunctureReportRequest
	) => {
		updateAcupunctureReportMutation.mutate({
			year,
			month,
			employeeId,
			request,
		});
	};

	const onEdit = async () => {
		const acupuncture_percentage: number | undefined =
			acupuncturePercentageInput === acupunctureReport.acupuncture_percentage
				? undefined
				: (acupuncturePercentageInput as number);
		const massage_percentage: number | undefined =
			massagePercentageInput === acupunctureReport.massage_percentage
				? undefined
				: (massagePercentageInput as number);
		const insurance_percentage: number | undefined =
			insurancePercentageInput === acupunctureReport.insurance_percentage
				? undefined
				: (insurancePercentageInput as number);
		const non_acupuncturist_insurance_percentage: number | undefined =
			nonAcupuncturistInsurancePercentageInput ===
			acupunctureReport.non_acupuncturist_insurance_percentage
				? undefined
				: (nonAcupuncturistInsurancePercentageInput as number);

		const updateAcupunctureReportRequest: UpdateAcupunctureReportRequest = {
			...(acupuncture_percentage !== undefined && { acupuncture_percentage }),
			...(massage_percentage !== undefined && { massage_percentage }),
			...(insurance_percentage !== undefined && { insurance_percentage }),
			...(non_acupuncturist_insurance_percentage !== undefined && {
				non_acupuncturist_insurance_percentage,
			}),
		};

		onEditAcupunctureReport(
			acupunctureReport.year,
			acupunctureReport.month,
			acupunctureReport.employee.employee_id,
			updateAcupunctureReportRequest
		);
	};

	const displayDate = () => {
		let localeDateFormat;
		if (language === Language.SIMPLIFIED_CHINESE) {
			localeDateFormat = 'zh-CN';
		} else if (language === Language.TRADITIONAL_CHINESE) {
			localeDateFormat = 'zh-TW';
		} else {
			localeDateFormat = undefined;
		}

		return getYearMonthString(date.year, date.month, localeDateFormat);
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
							className="text-base font-semibold leading-6 text-gray-900"
						>
							{t('Edit Acupuncture Report')}
						</Dialog.Title>

						<div className="mt-2">
							<h1 className="text-xl font-bold text-gray-900 mt-4">
								{t('Date')}:{' '}
								<span className="text-gray-500 font-extrabold underline">
									{displayDate()}
								</span>
							</h1>

							<h1 className="text-xl font-bold text-gray-900 my-2">
								{t('Employee')}:{' '}
								<span className="text-gray-500 font-extrabold underline">
									{acupunctureReport.employee.username}
								</span>
							</h1>

							<EditablePercentage
								originalPercentage={acupunctureReport.acupuncture_percentage}
								percentage={acupuncturePercentageInput}
								setPercentage={setAcupuncturePercentageInput}
								label={LABELS.acupuncture_report.acupuncture_percentage}
								name={NAMES.acupuncture_report.acupuncture_percentage}
								validationProp={{
									max: NUMBERS.acupuncture_report.acupuncture_percentage,
									required: true,
									requiredMessage:
										ERRORS.acupuncture_report.acupuncture_percentage.required,
									invalid: invalidAcupuncturePercentage,
									setInvalid: setInvalidAcupuncturePercentage,
									invalidMessage:
										ERRORS.acupuncture_report.acupuncture_percentage.invalid,
								}}
								placeholder={
									PLACEHOLDERS.acupuncture_report.acupuncture_percentage
								}
								editable={editable}
								missingPermissionMessage={ERRORS.payroll.permissions.edit}
							/>

							<EditablePercentage
								originalPercentage={acupunctureReport.massage_percentage}
								percentage={massagePercentageInput}
								setPercentage={setMassagePercentageInput}
								label={LABELS.acupuncture_report.massage_percentage}
								name={NAMES.acupuncture_report.massage_percentage}
								validationProp={{
									max: NUMBERS.acupuncture_report.massage_percentage,
									required: true,
									requiredMessage:
										ERRORS.acupuncture_report.massage_percentage.required,
									invalid: invalidMassagePercentage,
									setInvalid: setInvalidMassagePercentage,
									invalidMessage:
										ERRORS.acupuncture_report.massage_percentage.invalid,
								}}
								placeholder={PLACEHOLDERS.acupuncture_report.massage_percentage}
								editable={editable}
								missingPermissionMessage={ERRORS.payroll.permissions.edit}
							/>

							<EditablePercentage
								originalPercentage={acupunctureReport.insurance_percentage}
								percentage={insurancePercentageInput}
								setPercentage={setInsurancePercentageInput}
								label={LABELS.acupuncture_report.insurance_percentage}
								name={NAMES.acupuncture_report.insurance_percentage}
								validationProp={{
									max: NUMBERS.acupuncture_report.insurance_percentage,
									required: true,
									requiredMessage:
										ERRORS.acupuncture_report.insurance_percentage.required,
									invalid: invalidInsurancePercentage,
									setInvalid: setInvalidInsurancePercentage,
									invalidMessage:
										ERRORS.acupuncture_report.insurance_percentage.invalid,
								}}
								placeholder={
									PLACEHOLDERS.acupuncture_report.insurance_percentage
								}
								editable={editable}
								missingPermissionMessage={ERRORS.payroll.permissions.edit}
							/>

							<EditablePercentage
								originalPercentage={
									acupunctureReport.non_acupuncturist_insurance_percentage
								}
								percentage={nonAcupuncturistInsurancePercentageInput}
								setPercentage={setNonAcupuncturistInsurancePercentageInput}
								label={
									LABELS.acupuncture_report
										.non_acupuncturist_insurance_percentage
								}
								name={
									NAMES.acupuncture_report
										.non_acupuncturist_insurance_percentage
								}
								validationProp={{
									max: NUMBERS.acupuncture_report
										.non_acupuncturist_insurance_percentage,
									required: true,
									requiredMessage:
										ERRORS.acupuncture_report
											.non_acupuncturist_insurance_percentage.required,
									invalid: invalidNonAcupuncturistInsurancePercentage,
									setInvalid: setInvalidNonAcupuncturistInsurancePercentage,
									invalidMessage:
										ERRORS.acupuncture_report
											.non_acupuncturist_insurance_percentage.invalid,
								}}
								placeholder={
									PLACEHOLDERS.acupuncture_report
										.non_acupuncturist_insurance_percentage
								}
								editable={editable}
								missingPermissionMessage={ERRORS.payroll.permissions.edit}
							/>
						</div>
					</div>
				</div>
			</div>

			<EditBottom
				onCancel={() => setOpen(false)}
				disabledEdit={
					!editable || !changesMade || missingRequiredInput || invalidInput
				}
				editMissingPermissionMessage={
					!editable
						? ERRORS.payroll.permissions.edit
						: !changesMade
						? ERRORS.no_changes
						: missingRequiredInput
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

export default EditAcupunctureReport;
