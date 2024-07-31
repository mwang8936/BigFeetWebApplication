import { FC } from 'react';

import RetryButton from './RetryButton.Component';

interface RetryProp {
	retrying: boolean;
	error: string;
	onRetry(): void;
	enabled?: boolean;
}

const Retry: FC<RetryProp> = ({ retrying, error, onRetry, enabled = true }) => {
	return (
		<div className="retry-div">
			<h1>{error}</h1>
			<RetryButton loading={retrying} onRetry={onRetry} enabled={enabled} />
		</div>
	);
};

export default Retry;
