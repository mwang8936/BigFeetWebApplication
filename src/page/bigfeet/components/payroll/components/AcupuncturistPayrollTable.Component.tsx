import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

import { usePayrollDateContext } from '../PayRoll.Component';

import FilledPermissionsButton from '../../miscallaneous/FilledPermissionsButton.Component';
import { ButtonType } from '../../miscallaneous/PermissionsButton.Component';

import EditPayrollModal from '../../miscallaneous/modals/payroll/EditPayrollModal.Component';

import { useUserQuery } from '../../../../hooks/profile.hooks';

import ERRORS from '../../../../../constants/error.constants';

import {
	Language,
	PayrollPart,
	Permissions,
} from '../../../../../models/enums';
import Payroll from '../../../../../models/Payroll.Model';
import User from '../../../../../models/User.Model';

import { getShortMonthString } from '../../../../../utils/date.utils';
import {
	moneyToString,
	sessionToString,
} from '../../../../../utils/number.utils';

interface AcupuncturistPayrollTableProp {
	payroll: Payroll;
}

interface RowData {
	day: number;
	body: number;
	feet: number;
	acupuncture: number;
}

const AcupuncturistPayrollTable: FC<AcupuncturistPayrollTableProp> = ({
	payroll,
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

	const days =
		payroll.part === PayrollPart.PART_1
			? Array.from({ length: 15 }, (_, i) => i + 1)
			: Array.from({ length: 16 }, (_, i) => i + 16);

	const data: RowData[] = days.map((day) => {
		const scheduleData = payroll.data.find((row) => row.date.getDate() === day);

		if (scheduleData) {
			return {
				day,
				body: scheduleData.body_sessions,
				feet: scheduleData.feet_sessions,
				acupuncture: scheduleData.acupuncture_sessions,
			};
		} else {
			return {
				day,
				body: 0,
				feet: 0,
				acupuncture: 0,
			};
		}
	});

	const bodyRate = payroll.employee.body_rate ?? 0;
	const feetRate = payroll.employee.feet_rate ?? 0;
	const acupunctureRate = payroll.employee.acupuncture_rate ?? 0;

	const totalBodySessions = data
		.map((row) => row.body)
		.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);
	const totalFeetSessions = data
		.map((row) => row.feet)
		.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);
	const totalAcupunctureSessions = data
		.map((row) => row.acupuncture)
		.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);

	const totalBodyMoney = totalBodySessions * bodyRate;
	const totalFeetMoney = totalFeetSessions * feetRate;
	const totalAcupunctureMoney = totalAcupunctureSessions * acupunctureRate;

	const cheque = totalBodyMoney + totalFeetMoney + totalAcupunctureMoney;

	const exportToPDF = async () => {
		setExporting(true);

		const input = document.getElementById(`payroll-table-${payroll.part}`);
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
			`${payroll.employee.first_name}_${payroll.employee.last_name}-payroll-${
				payroll.year
			}-${displayDate()}-${payroll.part}.pdf`
		);
	};

	return (
		<div>
			<table
				className="table-fixed w-full text-xl"
				id={`payroll-table-${payroll.part}`}>
				<thead>
					<tr>
						<th className="border border-black border-2 p-2 font-bold w-auto">
							{displayDate()}
						</th>
						<th className="border border-black p-2 border-2 font-bold w-[30%]">
							{t('Body')}
						</th>
						<th className="border border-black p-2 border-2 font-bold w-[30%]">
							{t('Feet')}
						</th>
						<th className="border border-black p-2 border-2 font-bold w-[30%]">
							{t('Acupuncture')}
						</th>
					</tr>
				</thead>
				<tbody>
					{data.map((row, index) => (
						<tr
							key={index}
							className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
							<td className="border border-gray-300 text-center">{row.day}</td>
							<td className="border border-gray-300 text-right pr-2">
								{sessionToString(row.body)}
							</td>
							<td className="border border-gray-300 text-right pr-2">
								{sessionToString(row.feet)}
							</td>
							<td className="border border-gray-300 text-right pr-2">
								{sessionToString(row.acupuncture)}
							</td>
						</tr>
					))}

					<tr className="bg-blue-100 font-bold">
						<td className="border-black border-2 pl-2">{t('SUM')}</td>
						<td className="border-black border-2 text-right pr-2">
							{sessionToString(totalBodySessions)}
						</td>
						<td className="border-black border-2 text-right pr-2">
							{sessionToString(totalFeetSessions)}
						</td>
						<td className="border-black border-2 text-right pr-2">
							{sessionToString(totalAcupunctureSessions)}
						</td>
					</tr>

					<tr className="bg-green-100 font-bold">
						<td className="border-black border-2 pl-2">{t('PAY/PER')}</td>
						<td className="border-black border-2 text-right pr-2">
							${moneyToString(bodyRate)}
						</td>
						<td className="border-black border-2 text-right pr-2">
							${moneyToString(feetRate)}
						</td>
						<td className="border-black border-2 text-right pr-2">
							${moneyToString(acupunctureRate)}
						</td>
					</tr>

					<tr className="bg-yellow-100 font-bold">
						<td className="border-black border-2 pl-2">{t('TOTAL')}</td>
						<td className="border-black border-2 text-right pr-2">
							${moneyToString(totalBodyMoney)}
						</td>
						<td className="border-black border-2 text-right pr-2">
							${moneyToString(totalFeetMoney)}
						</td>
						<td className="border-black border-2 text-right pr-2">
							${moneyToString(totalAcupunctureMoney)}
						</td>
					</tr>

					<tr className="font-extrabold">
						<td />
						<td />
						<td className="border-black border-2 pl-2 bg-yellow-400">
							{t('CHEQUE')}:
						</td>
						<td className="border-black border-2 text-right pr-2 bg-yellow-400">
							${moneyToString(cheque)}
						</td>
					</tr>
				</tbody>
			</table>

			<FilledPermissionsButton
				btnTitle={'Edit Payroll'}
				disabled={!editable}
				missingPermissionMessage={ERRORS.payroll.permissions.edit}
				onClick={() => {
					setOpenEditModal(true);
				}}
			/>

			<FilledPermissionsButton
				btnTitle={'Export Payroll'}
				btnType={ButtonType.ADD}
				disabled={exporting}
				missingPermissionMessage="Exporting..."
				onClick={() => {
					exportToPDF().finally(() => setExporting(false));
				}}
			/>

			<EditPayrollModal
				open={openEditModal}
				setOpen={setOpenEditModal}
				payroll={payroll}
			/>
		</div>
	);
};

export default AcupuncturistPayrollTable;
