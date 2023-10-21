import { useEffect } from 'react';
import { colorDropDownItems } from '../../../../constants/drop-down.constants';
import LENGTHS from '../../../../constants/lengths.constants';
import PATTERNS from '../../../../constants/patterns.constants';
import { ServiceColor } from '../../../../models/enums';
import AddDropDown from '../miscallaneous/AddDropDown.Component';
import AddInput from '../miscallaneous/AddInput.Component';
import AddMinute from '../miscallaneous/AddMinuteComponent';
import AddPayRate from '../miscallaneous/AddPayRate.Component';
import BodyFeetService from './BodyFeetService.Component';

interface AddServiceProp {
	setColor(color: ServiceColor | null): void;
}

export default function AddService(prop: AddServiceProp) {
	useEffect(() => {
		prop.setColor(null);
	}, []);

	return (
		<>
			<AddInput
				defaultText=''
				label='Service Name'
				name='service_name'
				type='text'
				pattern={PATTERNS.service.service_name}
				maxLength={LENGTHS.service.service_name}
				placeholder='Body'
				required={true}
				invalidMessage='Service Name must be within 1-50 characters.'
				requiredMessage='Service Name cannot be empty.'
			/>

			<AddInput
				defaultText=''
				label='Shorthand'
				name='shorthand'
				type='text'
				pattern={PATTERNS.service.shorthand}
				maxLength={LENGTHS.service.shorthand}
				placeholder='BD'
				required={true}
				invalidMessage='Shorthand must be within 1-50 characters.'
				requiredMessage='Shorthand cannot be empty.'
			/>

			<AddMinute
				defaultText=''
				label='Time (Minutes)'
				name='time'
				max={180}
				required={true}
				invalidMessage='Time cannot be over 180 minutes and only contain digits.'
				requiredMessage='Time cannot be empty.'
			/>

			<AddPayRate
				defaultText=''
				label='Money'
				name='money'
				max={999}
				required={true}
				invalidMessage='Money must be between $0-999 and limited to 2 decimal places.'
				requiredMessage='Money cannot be empty.'
			/>

			<BodyFeetService editable={true} body={0} feet={0} />

			<AddDropDown
				default={colorDropDownItems[0]}
				options={colorDropDownItems}
				onSelect={(option) => {
					if (option.id == null) prop.setColor(null);
					else prop.setColor(option.id as ServiceColor);
				}}
				label='Color'
				required={true}
				requiredMessage='A color must be selected.'
			/>
		</>
	);
}
