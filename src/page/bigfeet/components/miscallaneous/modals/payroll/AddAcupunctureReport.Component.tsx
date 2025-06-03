import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog } from '@headlessui/react';

import { PlusCircleIcon } from '@heroicons/react/20/solid';

import AddBottom from '../AddBottom.Component';

import AddPercentage from '../../add/AddPercentage.Component';

import { usePayrollDateContext } from '../../../payroll/PayRoll.Component';

import { useAddAcupunctureReportMutation } from '../../../../../hooks/acupuncture-report.hooks';
import { useUserQuery } from '../../../../../hooks/profile.hooks';

import ERRORS from '../../../../../../constants/error.constants';
import LABELS from '../../../../../../constants/label.constants';
import NAMES from '../../../../../../constants/name.constants';
import NUMBERS from '../../../../../../constants/numbers.constants';
import PLACEHOLDERS from '../../../../../../constants/placeholder.constants';

import Employee from '../../../../../../models/Employee.Model';
import { Language, Permissions } from '../../../../../../models/enums';
import User from '../../../../../../models/User.Model';

import { AddAcupunctureReportRequest } from '../../../../../../models/requests/Acupuncture-Report.Request.Model';

import { getYearMonthString } from '../../../../../../utils/date.utils';

interface AddAcupunctureReportProp {
	setOpen(open: boolean): void;
	employee: Employee;
}

const AddAcupunctureReport: FC<AddAcupunctureReportProp> = ({
	setOpen,
	employee,
}) => {
	const { t } = useTranslation();

	const { date } = usePayrollDateContext();

	const [acupuncturePercentageInput, setAcupuncturePercentageInput] = useState<
		number | null
	>(0.7);
	const [massagePercentageInput, setMassagePercentageInput] = useState<
		number | null
	>(0.3);
	const [insurancePercentageInput, setInsurancePercentageInput] = useState<
		number | null
	>(0.3);
	const [
		nonAcupuncturistInsurancePercentageInput,
		setNonAcupuncturistInsurancePercentageInput,
	] = useState<number | null>(0.7);

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

	const [missingRequiredInput, setMissingRequiredInput] =
		useState<boolean>(true);
	const [invalidInput, setInvalidInput] = useState<boolean>(false);

	const userQuery = useUserQuery({ gettable: true, staleTime: Infinity });
	const user: User = userQuery.data;

	const language = user.language;

	const creatable = user.permissions.includes(
		Permissions.PERMISSION_ADD_PAYROLL
	);

	useEffect(() => {
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

	const addAcupunctureReportMutation = useAddAcupunctureReportMutation({
		onSuccess: () => setOpen(false),
	});
	const onAddAcupunctureReport = async (
		request: AddAcupunctureReportRequest
	) => {
		addAcupunctureReportMutation.mutate({ request });
	};

	const onAdd = async () => {
		const year = date.year;
		const month = date.month;
		const employee_id = employee.employee_id;
		const acupuncture_percentage = acupuncturePercentageInput as number;
		const massage_percentage = massagePercentageInput as number;
		const insurance_percentage = insurancePercentageInput as number;
		const non_acupuncturist_insurance_percentage =
			nonAcupuncturistInsurancePercentageInput as number;

		const addAcupunctureReportRequest: AddAcupunctureReportRequest = {
			year,
			month,
			employee_id,
			acupuncture_percentage,
			massage_percentage,
			insurance_percentage,
			non_acupuncturist_insurance_percentage,
		};

		onAddAcupunctureReport(addAcupunctureReportRequest);
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
					<div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
						<PlusCircleIcon
							className="h-6 w-6 text-green-600"
							aria-hidden="true"
						/>
					</div>

					<div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
						<Dialog.Title
							as="h3"
							className="text-base font-semibold leading-6 text-gray-900"
						>
							{t('Add Acupuncture Report')}
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
									{employee.username}
								</span>
							</h1>

							<AddPercentage
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
							/>

							<AddPercentage
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
							/>

							<AddPercentage
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
							/>

							<AddPercentage
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
							/>
						</div>
					</div>
				</div>
			</div>

			<AddBottom
				onCancel={() => setOpen(false)}
				disabledAdd={!creatable || missingRequiredInput || invalidInput}
				addMissingPermissionMessage={
					!creatable
						? ERRORS.payroll.permissions.add
						: missingRequiredInput
						? ERRORS.required
						: invalidInput
						? ERRORS.invalid
						: ''
				}
				onAdd={onAdd}
			/>
		</>
	);
};

export default AddAcupunctureReport;
