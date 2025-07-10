import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

import { usePayrollDateContext } from '../PayRoll.Component';

import FilledPermissionsButton from '../../miscallaneous/FilledPermissionsButton.Component';
import { ButtonType } from '../../miscallaneous/PermissionsButton.Component';

import EditAcupunctureReportModal from '../../miscallaneous/modals/payroll/EditAcupunctureReportModal.Component';

import { useUserQuery } from '../../../../hooks/profile.hooks';

import ERRORS from '../../../../../constants/error.constants';

import AcupunctureReport from '../../../../../models/Acupuncture-Report.Model';
import { Language, Permissions } from '../../../../../models/enums';
import User from '../../../../../models/User.Model';

import { getShortMonthString } from '../../../../../utils/date.utils';
import {
	moneyToString,
	percentageToString,
} from '../../../../../utils/number.utils';

interface AcupunctureReportTableProp {
	acupunctureReport: AcupunctureReport;
}

interface RowData {
	day: number;
	acupuncture: number;
	massage: number;
	insurance: number;
	non_acupuncturist_insurance: number;
	total: number;
}

const AcupunctureReportTable: FC<AcupunctureReportTableProp> = ({
	acupunctureReport,
}) => {
	const { t } = useTranslation();

	const { date } = usePayrollDateContext();

	const [openEditModal, setOpenEditModal] = useState<boolean>(false);

	const [exporting, setExporting] = useState<boolean>(false);

	const userQuery = useUserQuery({ gettable: true, staleTime: Infinity });
	const user: User = userQuery.data;

	const editable = user.permissions.includes(
		Permissions.PERMISSION_UPDATE_PAYROLL
	);

	const language = user.language;

	const displayDate = () => {
		let localeDateFormat;
		if (language === Language.SIMPLIFIED_CHINESE) {
			localeDateFormat = 'zh-CN';
		} else if (language === Language.TRADITIONAL_CHINESE) {
			localeDateFormat = 'zh-TW';
		} else {
			localeDateFormat = undefined;
		}

		return getShortMonthString(date.month, localeDateFormat);
	};

	const days = Array.from({ length: 31 }, (_, i) => i + 1);

	const data: RowData[] = days.map((day) => {
		const scheduleData = acupunctureReport.data.find(
			(row) => row.date.getDate() === day
		);

		if (scheduleData) {
			const total =
				scheduleData.acupuncture * acupunctureReport.acupuncture_percentage +
				scheduleData.massage * acupunctureReport.massage_percentage -
				scheduleData.insurance * acupunctureReport.insurance_percentage -
				scheduleData.non_acupuncturist_insurance *
					acupunctureReport.non_acupuncturist_insurance_percentage;

			return {
				day,
				acupuncture: scheduleData.acupuncture,
				massage: scheduleData.massage,
				insurance: scheduleData.insurance,
				non_acupuncturist_insurance: scheduleData.non_acupuncturist_insurance,
				total,
			};
		} else {
			return {
				day,
				acupuncture: 0,
				massage: 0,
				insurance: 0,
				non_acupuncturist_insurance: 0,
				total: 0,
			};
		}
	});

	const acupuncturePercentage = acupunctureReport.acupuncture_percentage;
	const massagePercentage = acupunctureReport.massage_percentage;
	const insurancePercentage = acupunctureReport.insurance_percentage;
	const nonAcupuncturistInsurancePercentage =
		acupunctureReport.non_acupuncturist_insurance_percentage;

	const totalAcupuncture = data
		.map((row) => row.acupuncture)
		.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);
	const totalMassage = data
		.map((row) => row.massage)
		.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);
	const totalInsurance = data
		.map((row) => row.insurance)
		.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);
	const totalNonAcupuncturistInsurance = data
		.map((row) => row.non_acupuncturist_insurance)
		.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);

	const totalAcupunctureMoney = totalAcupuncture * acupuncturePercentage;
	const totalMassageMoney = totalMassage * massagePercentage;
	const totalInsuranceMoney = totalInsurance * insurancePercentage;
	const totalNonAcupuncturistInsuranceMoney =
		totalNonAcupuncturistInsurance * nonAcupuncturistInsurancePercentage;

	const totalMoney = data
		.map((row) => row.total)
		.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);

	const exportToPDF = async () => {
		setExporting(true);

		const input = document.getElementById(`acupuncture-report-table`);
		if (!input) return;

		const canvas = await html2canvas(input, {
			scale: 2, // Adjust scale for better resolution
			useCORS: true,
		});
		const imgData = canvas.toDataURL('image/png');
		const pdf = new jsPDF();
		const imgWidth = pdf.internal.pageSize.width - 20; // Set margin on left and right
		const pageHeight = pdf.internal.pageSize.height;
		const imgHeight = (canvas.height * imgWidth) / canvas.width;
		let heightLeft = imgHeight;

		let position = 10; // Start position (top margin)

		pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
		heightLeft -= pageHeight;

		while (heightLeft >= 0) {
			position = heightLeft - imgHeight;
			pdf.addPage();
			pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
			heightLeft -= pageHeight;
		}

		pdf.save(
			`${acupunctureReport.employee.first_name}_${
				acupunctureReport.employee.last_name
			}-acupuncture-report-${acupunctureReport.year}-${displayDate()}.pdf`
		);
	};

	return (
		<div>
			<table
				className="table-fixed w-full text-xl"
				id="acupuncture-report-table"
			>
				<thead>
					<tr>
						<th className="border border-black border-2 p-2 font-bold w-auto">
							{displayDate()}
						</th>
						<th className="border border-black p-2 border-2 font-bold w-[18%]">
							{t('Acupuncture')}
						</th>
						<th className="border border-black p-2 border-2 font-bold w-[18%]">
							{t('Massage')}
						</th>
						<th className="border border-black p-2 border-2 font-bold w-[18%]">
							{t('Insurance')}
						</th>
						<th className="border border-black p-2 border-2 font-bold w-[18%]">
							{t('Insurance (Other)')}
						</th>
						<th className="border border-black p-2 border-2 font-bold w-[18%]">
							{t('Total')}
						</th>
					</tr>
				</thead>
				<tbody>
					{data.map((row, index) => (
						<tr
							key={index}
							className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}
						>
							<td className="border border-gray-300 text-center">{row.day}</td>
							<td className="border border-gray-300 text-right pr-2">
								{moneyToString(row.acupuncture)}
							</td>
							<td className="border border-gray-300 text-right pr-2">
								{moneyToString(row.massage)}
							</td>
							<td className="border border-gray-300 text-right pr-2">
								{moneyToString(row.insurance)}
							</td>
							<td className="border border-gray-300 text-right pr-2">
								{moneyToString(row.non_acupuncturist_insurance)}
							</td>
							<td className="border border-gray-300 text-right pr-2">
								{moneyToString(row.total)}
							</td>
						</tr>
					))}

					<tr className="font-bold">
						<td className="border-black border-2 pl-2 bg-blue-100">
							{t('SUM')}
						</td>
						<td className="border-black border-2 text-right pr-2 bg-blue-100">
							${moneyToString(totalAcupuncture)}
						</td>
						<td className="border-black border-2 text-right pr-2 bg-blue-100">
							${moneyToString(totalMassage)}
						</td>
						<td className="border-black border-2 text-right pr-2 bg-blue-100">
							${moneyToString(totalInsurance)}
						</td>
						<td className="border-black border-2 text-right pr-2 bg-blue-100">
							${moneyToString(totalNonAcupuncturistInsurance)}
						</td>
					</tr>

					<tr className="font-bold">
						<td className="border-black border-2 pl-2 bg-green-100">
							{t('PERCENT')}
						</td>
						<td className="border-black border-2 text-right pr-2 bg-green-100">
							{percentageToString(acupuncturePercentage)}%
						</td>
						<td className="border-black border-2 text-right pr-2 bg-green-100">
							{percentageToString(massagePercentage)}%
						</td>
						<td className="border-black border-2 text-right pr-2 bg-green-100">
							-{percentageToString(insurancePercentage)}%
						</td>
						<td className="border-black border-2 text-right pr-2 bg-green-100">
							-{percentageToString(nonAcupuncturistInsurancePercentage)}%
						</td>
					</tr>

					<tr className="font-bold">
						<td className="border-black border-2 pl-2 bg-yellow-100">
							{t('TOTAL')}
						</td>
						<td className="border-black border-2 text-right pr-2 bg-yellow-100">
							${moneyToString(totalAcupunctureMoney)}
						</td>
						<td className="border-black border-2 text-right pr-2 bg-yellow-100">
							${moneyToString(totalMassageMoney)}
						</td>
						<td className="border-black border-2 text-right pr-2 bg-yellow-100">
							{totalInsuranceMoney === 0
								? `$0`
								: `-$${moneyToString(totalInsuranceMoney)}`}
						</td>
						<td className="border-black border-2 text-right pr-2 bg-yellow-100">
							{totalNonAcupuncturistInsuranceMoney === 0
								? `$0`
								: `-$${moneyToString(totalNonAcupuncturistInsuranceMoney)}`}
						</td>
					</tr>

					<tr className="font-extrabold">
						<td />
						<td />
						<td />
						<td />
						<td className="border-black border-2 pl-2 bg-yellow-400">
							{t('CHEQUE')}:
						</td>
						<td className="border-black border-2 text-right pr-2 bg-yellow-400">
							${moneyToString(totalMoney)}
						</td>
					</tr>
				</tbody>
			</table>

			<FilledPermissionsButton
				btnTitle={'Edit Acupuncture Report'}
				disabled={!editable}
				missingPermissionMessage={ERRORS.payroll.permissions.edit}
				onClick={() => {
					setOpenEditModal(true);
				}}
			/>

			<FilledPermissionsButton
				btnTitle={'Export Acupuncture Report'}
				btnType={ButtonType.ADD}
				disabled={exporting}
				missingPermissionMessage="Exporting..."
				onClick={() => {
					exportToPDF().finally(() => setExporting(false));
				}}
			/>

			<EditAcupunctureReportModal
				open={openEditModal}
				setOpen={setOpenEditModal}
				acupunctureReport={acupunctureReport}
			/>
		</div>
	);
};

export default AcupunctureReportTable;
