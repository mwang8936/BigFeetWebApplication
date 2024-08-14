import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { useUserQuery } from '../../../hooks/profile.hooks';

import { Language } from '../../../../models/enums';
import User from '../../../../models/User.Model';

interface DatesDisplayProp {
	updatedAt: Date;
	createdAt: Date;
}

const DatesDisplay: FC<DatesDisplayProp> = ({ updatedAt, createdAt }) => {
	const { t } = useTranslation();

	const userQuery = useUserQuery({ gettable: true, staleTime: Infinity });
	const user: User = userQuery.data;

	const language = user.language;

	let localeDateFormat;
	if (language === Language.SIMPLIFIED_CHINESE) {
		localeDateFormat = 'zh-CN';
	} else if (language === Language.TRADITIONAL_CHINESE) {
		localeDateFormat = 'zh-TW';
	} else {
		localeDateFormat = undefined;
	}

	const updatedAtString = updatedAt.toLocaleDateString(localeDateFormat, {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});

	const createdAtString = createdAt.toLocaleDateString(localeDateFormat, {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});

	return (
		<div className="dates-bar">
			<div>
				{t('Last Updated')}
				{updatedAtString}
			</div>
			<div>
				{t('Created')}
				{createdAtString}
			</div>
		</div>
	);
};

export default DatesDisplay;
