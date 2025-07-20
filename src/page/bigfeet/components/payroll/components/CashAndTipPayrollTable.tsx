import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

import { usePayrollDateContext } from '../PayRoll.Component';

import FilledPermissionsButton from '../../miscallaneous/FilledPermissionsButton.Component';
import { ButtonType } from '../../miscallaneous/PermissionsButton.Component';

import { useRefreshPayrollMutation } from '../../../../hooks/payroll.hooks';
import { useUserQuery } from '../../../../hooks/profile.hooks';

import { Language, PayrollPart } from '../../../../../models/enums';
import Payroll from '../../../../../models/Payroll.Model';
import User from '../../../../../models/User.Model';

import {
	getShortMonthString,
	isHoliday,
} from '../../../../../utils/date.utils';
import { moneyToString } from '../../../../../utils/number.utils';

interface CashAndTipPayrollTableProp {
	payroll: Payroll;
}

interface RowData {
	day: number;
	cash: number;
	tips: number;
	total: number;
}

const CashAndTipPayrollTable: FC<CashAndTipPayrollTableProp> = ({
	payroll,
}) => {
	const { t } = useTranslation();

	const { date } = usePayrollDateContext();

	const [exporting, setExporting] = useState<boolean>(false);

	const userQuery = useUserQuery({ gettable: true, staleTime: Infinity });
	const user: User = userQuery.data;

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
			const totalSessions =
				scheduleData.acupuncture_sessions +
				scheduleData.body_sessions +
				scheduleData.feet_sessions;

			const requestedSessions =
				scheduleData.requested_acupuncture_sessions +
				scheduleData.requested_body_sessions +
				scheduleData.requested_feet_sessions;

			const holidayPay = isHoliday(new Date(date.year, date.month - 1, day))
				? 2 * totalSessions
				: 0;

			const cash =
				requestedSessions +
				holidayPay +
				scheduleData.award_amount +
				scheduleData.vip_amount +
				scheduleData.total_cash_out;

			const tips = scheduleData.tips * 0.9;

			return {
				day,
				cash,
				tips,
				total: cash + tips,
			};
		} else {
			return {
				day,
				cash: 0,
				tips: 0,
				total: 0,
			};
		}
	});

	const totalCash = data.reduce((sum, row) => sum + row.cash, 0);
	const totalTips = data.reduce((sum, row) => sum + row.tips, 0);
	const total = totalCash + totalTips;

	const refreshPayrollMutation = useRefreshPayrollMutation({});

	const refreshPayroll = async (
		year: number,
		month: number,
		part: PayrollPart,
		employeeId: number
	) => {
		refreshPayrollMutation.mutate({ year, month, part, employeeId });
	};

	const exportToPDF = async () => {
		setExporting(true);

		const input = document.getElementById(
			`cash-and-tips-table-${payroll.part}`
		);
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
				id={`cash-and-tips-table-${payroll.part}`}
			>
				<thead>
					<tr>
						<th className="border border-black border-2 p-2 font-bold w-auto">
							{displayDate()}
						</th>
						<th className="border border-black p-2 border-2 font-bold w-[30%]">
							{t('Cash')}
						</th>
						<th className="border border-black p-2 border-2 font-bold w-[30%]">
							{t('Tips')}
						</th>
						<th className="border border-black p-2 border-2 font-bold w-[30%]">
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
								{moneyToString(row.cash)}
							</td>
							<td className="border border-gray-300 text-right pr-2">
								{moneyToString(row.tips)}
							</td>
							<td className="border border-gray-300 text-right pr-2">
								{moneyToString(row.total)}
							</td>
						</tr>
					))}

					<tr className="bg-blue-100 font-bold">
						<td className="border-black border-2 pl-2">{t('SUM')}</td>
						<td className="border-black border-2 text-right pr-2">
							{moneyToString(totalCash)}
						</td>
						<td className="border-black border-2 text-right pr-2">
							{moneyToString(totalTips)}
						</td>
						<td className="border-black border-2 text-right pr-2">
							{moneyToString(total)}
						</td>
					</tr>

					<tr className="font-extrabold">
						<td />
						<td />
						<td className="border-black border-2 pl-2 bg-yellow-400">
							{t('CASH OUT')}:
						</td>
						<td className="border-black border-2 text-right pr-2 bg-yellow-400">
							${moneyToString(total)}
						</td>
					</tr>
				</tbody>
			</table>

			<FilledPermissionsButton
				btnTitle={'Refresh Payroll'}
				btnType={ButtonType.CANCEL}
				disabled={false}
				missingPermissionMessage={''}
				onClick={() => {
					refreshPayroll(
						payroll.year,
						payroll.month,
						payroll.part,
						payroll.employee.employee_id
					);
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
		</div>
	);
};

export default CashAndTipPayrollTable;
