import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import dayjs from 'dayjs';

interface TimePickerMaterialUIProp {
	label: string;
	defaultTime: Date | null;
	onTimeSelected(time: Date | null): void;
}
export default function TimePickerMaterialUI(prop: TimePickerMaterialUIProp) {
	const dayjsTime = dayjs(prop.defaultTime);

	const onTimeSelected = (time: dayjs.Dayjs | null) => {
		if (time == null) prop.onTimeSelected(null);
		else prop.onTimeSelected(time.toDate());
	};
	return (
		<div>
			<LocalizationProvider dateAdapter={AdapterDayjs}>
				<MobileTimePicker
					label={prop.label}
					defaultValue={dayjsTime}
					onAccept={onTimeSelected}
				/>
			</LocalizationProvider>
		</div>
	);
}
