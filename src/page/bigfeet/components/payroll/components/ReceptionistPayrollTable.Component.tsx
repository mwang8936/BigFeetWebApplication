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

import {
	getShortMonthString,
	isHoliday,
} from '../../../../../utils/date.utils';
import {
	moneyToString,
	sessionToString,
} from '../../../../../utils/number.utils';
import { formatTimeFromDate } from '../../../../../utils/string.utils';

interface ReceptionistPayrollTableProp {
	payroll: Payroll;
}

interface RowData {
	day: number;
	start: Date | null;
	end: Date | null;
	hours: number;
	body: number;
	feet: number;
	hours_minus_sessions: number;
	holiday: boolean;
	total_hours: number;
}

const ReceptionistPayrollTable: FC<ReceptionistPayrollTableProp> = ({
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
			const start = scheduleData.start;
			const end = scheduleData.end;

			const hours =
				start !== null && end !== null
					? (end.getTime() - start.getTime()) / 3600000
					: 0;

			const body =
				scheduleData.body_sessions + scheduleData.acupuncture_sessions;
			const feet = scheduleData.feet_sessions;

			const hours_minus_sessions = Math.max(hours - body - feet, 0);

			const holiday = isHoliday(new Date(date.year, date.month - 1, day));

			const total_hours = Math.max(
				holiday ? 1.5 * hours_minus_sessions : hours_minus_sessions,
				0
			);

			return {
				day,
				start,
				end,
				hours,
				body,
				feet,
				hours_minus_sessions,
				holiday,
				total_hours,
			};
		} else {
			return {
				day,
				start: null,
				end: null,
				hours: 0,
				body: 0,
				feet: 0,
				hours_minus_sessions: 0,
				holiday: isHoliday(new Date(date.year, date.month - 1, day)),
				total_hours: 0,
			};
		}
	});

	const bodyRate = payroll.employee.body_rate ?? 0;
	const feetRate = payroll.employee.feet_rate ?? 0;
	const hourlyRate = payroll.employee.per_hour ?? 0;

	const totalBodySessions = data
		.map((row) => row.body)
		.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);
	const totalFeetSessions = data
		.map((row) => row.feet)
		.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);
	const totalHours = data
		.map((row) => row.hours)
		.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);
	const totalHoursMinusSessions = data
		.map((row) => row.hours_minus_sessions)
		.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);
	const totalHoursFinal = data
		.map((row) => row.total_hours)
		.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);

	const totalBodyMoney = totalBodySessions * bodyRate;
	const totalFeetMoney = totalFeetSessions * feetRate;
	const totalHourlyMoney = totalHoursMinusSessions * hourlyRate;

	const cheque = totalBodyMoney + totalFeetMoney + totalHourlyMoney;

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
						<th className="border border-black p-2 border-2 font-bold w-[11.25%]">
							{t('Start')}
						</th>
						<th className="border border-black p-2 border-2 font-bold w-[11.25%]">
							{t('End')}
						</th>
						<th className="border border-black p-2 border-2 font-bold w-[11.25%]">
							{t('Hours')}
						</th>
						<th className="border border-black p-2 border-2 font-bold w-[11.25%]">
							{t('Body')}
						</th>
						<th className="border border-black p-2 border-2 font-bold w-[11.25%]">
							{t('Feet')}
						</th>
						<th className="border border-black p-2 border-2 font-bold w-[11.25%]">
							{t('Counted Hours')}
						</th>
						<th className="border border-black p-2 border-2 font-bold w-[11.25%]">
							{t('Holiday Rate')}
						</th>
						<th className="border border-black p-2 border-2 font-bold w-[11.25%]">
							{t('Total Hours')}
						</th>
					</tr>
				</thead>
				<tbody>
					{data.map((row, index) => (
						<tr
							key={index}
							className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
							<td className="border border-gray-300 text-center">{row.day}</td>
							<td
								className={`border border-gray-300 ${
									row.start ? 'text-right pr-2' : 'text-center'
								}`}>
								{row.start ? formatTimeFromDate(row.start) : '-'}
							</td>
							<td
								className={`border border-gray-300 ${
									row.end ? 'text-right pr-2' : 'text-center'
								}`}>
								{row.end ? formatTimeFromDate(row.end) : '-'}
							</td>
							<td className="border border-gray-300 text-right pr-2">
								{moneyToString(row.hours)}
							</td>
							<td className="border border-gray-300 text-right pr-2">
								{sessionToString(row.body)}
							</td>
							<td className="border border-gray-300 text-right pr-2">
								{sessionToString(row.feet)}
							</td>
							<td className="border border-gray-300 text-right pr-2">
								{moneyToString(row.hours_minus_sessions)}
							</td>
							<td className="border border-gray-300 text-center">
								{row.holiday ? '× 1.5' : '× 1'}
							</td>
							<td className="border border-gray-300 text-right pr-2">
								{moneyToString(row.total_hours)}
							</td>
						</tr>
					))}

					<tr className="font-bold">
						<td />
						<td />
						<td className="border-black border-2 pl-2 bg-blue-100 ">
							{t('SUM')}
						</td>
						<td className="border-black border-2 text-right pr-2 bg-blue-100 ">
							{moneyToString(totalHours)}
						</td>
						<td className="border-black border-2 text-right pr-2 bg-blue-100 ">
							{sessionToString(totalBodySessions)}
						</td>
						<td className="border-black border-2 text-right pr-2 bg-blue-100 ">
							{sessionToString(totalFeetSessions)}
						</td>
						<td className="border-black border-2 text-right pr-2 bg-blue-100 ">
							{moneyToString(totalHoursMinusSessions)}
						</td>
						<td className="border-black border-2 text-center bg-blue-100 ">
							-
						</td>
						<td className="border-black border-2 text-right pr-2 bg-blue-100 ">
							{moneyToString(totalHoursFinal)}
						</td>
					</tr>

					<tr className="font-bold">
						<td />
						<td />
						<td />
						<td className="border-black border-2 pl-2 bg-green-100 ">
							{t('PAY/PER')}
						</td>
						<td className="border-black border-2 text-right pr-2 bg-green-100 ">
							${moneyToString(bodyRate)}
						</td>
						<td className="border-black border-2 text-right pr-2 bg-green-100 ">
							${moneyToString(feetRate)}
						</td>
						<td className="border-black border-2 text-center bg-green-100 ">
							-
						</td>
						<td className="border-black border-2 text-center bg-green-100 ">
							-
						</td>
						<td className="border-black border-2 text-right pr-2 bg-green-100 ">
							${moneyToString(hourlyRate)}
						</td>
					</tr>

					<tr className="font-bold">
						<td />
						<td />
						<td />
						<td className="border-black border-2 pl-2 bg-yellow-100">
							{t('TOTAL')}
						</td>
						<td className="border-black border-2 text-right pr-2 bg-yellow-100">
							${moneyToString(totalBodyMoney)}
						</td>
						<td className="border-black border-2 text-right pr-2 bg-yellow-100">
							${moneyToString(totalFeetMoney)}
						</td>
						<td className="border-black border-2 text-center bg-yellow-100">
							-
						</td>
						<td className="border-black border-2 text-center bg-yellow-100">
							-
						</td>
						<td className="border-black border-2 text-right pr-2 bg-yellow-100">
							${moneyToString(totalHourlyMoney)}
						</td>
					</tr>

					<tr className="font-extrabold">
						<td />
						<td />
						<td />
						<td />
						<td />
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

export default ReceptionistPayrollTable;
