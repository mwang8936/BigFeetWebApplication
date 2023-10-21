import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import dayjs from 'dayjs';

interface DatePickerMaterialUIProp {
	label: string;
	defaultDate: Date | null;
	onDateSelected(date: Date | null): void;
}
export default function DatePickerMaterialUI(prop: DatePickerMaterialUIProp) {
	const dayjsDate = dayjs(prop.defaultDate);

	const onDateSelected = (date: dayjs.Dayjs | null) => {
		if (date == null) prop.onDateSelected(null);
		else prop.onDateSelected(date.toDate());
	};
	return (
		<div>
			<LocalizationProvider dateAdapter={AdapterDayjs}>
				<MobileDatePicker
					label={prop.label}
					defaultValue={dayjsDate}
					onAccept={onDateSelected}
				/>
			</LocalizationProvider>
		</div>
	);
}
