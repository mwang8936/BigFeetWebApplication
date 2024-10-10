import { FC } from 'react';

import EditAcupunctureReport from './EditAcupunctureReport.Component';

import BaseModal from '../BaseModal.Component';

import AcupunctureReport from '../../../../../../models/Acupuncture-Report.Model';

interface EditAcupunctureReportModalProp {
	open: boolean;
	setOpen(open: boolean): void;
	acupunctureReport: AcupunctureReport;
}

const EditAcupunctureReportModal: FC<EditAcupunctureReportModalProp> = ({
	open,
	setOpen,
	acupunctureReport,
}) => {
	return (
		<BaseModal
			open={open}
			setOpen={setOpen}
			contentElement={
				<EditAcupunctureReport
					setOpen={setOpen}
					acupunctureReport={acupunctureReport}
				/>
			}
		/>
	);
};

export default EditAcupunctureReportModal;
