import RetryButton from './RetryButton.Component';

interface RetryProp {
	retrying: boolean;
	error: string;
	onRetry(): void;
	enabled?: boolean;
}

const Retry: React.FC<RetryProp> = ({
	retrying,
	error,
	onRetry,
	enabled = true,
}) => {
	return (
		<div className="m-auto text-gray-700 text-xl font-bold flex flex-col items-center justify-center">
			<h1>{error}</h1>
			<RetryButton loading={retrying} onRetry={onRetry} enabled={enabled} />
		</div>
	);
};

export default Retry;
