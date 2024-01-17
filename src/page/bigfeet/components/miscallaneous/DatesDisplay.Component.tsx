import { FC } from 'react';
import { useTranslation } from 'react-i18next';

interface DatesDisplayProp {
	updatedAt: Date;
	createdAt: Date;
}

const DatesDisplay: FC<DatesDisplayProp> = ({ updatedAt, createdAt }) => {
	const { t } = useTranslation();

	return (
		<div className="flex flex-col text-sm font-medium text-gray-500 italic">
			<div>
				{t('Last Updated', { updated_at: updatedAt.toLocaleDateString() })}
			</div>
			<div>{t('Created', { created_at: createdAt.toLocaleDateString() })}</div>
		</div>
	);
};

export default DatesDisplay;
