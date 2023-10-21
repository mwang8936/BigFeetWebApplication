import RetryButton from './RetryButton.Component';

interface RetryProp {
	retrying: boolean;
	error: string;
	onRetry(): void;
}

export default function Retry(prop: RetryProp) {
	return (
		<div className='m-auto text-gray-700 text-xl font-bold flex flex-col items-center justify-center'>
			<h1>{prop.error}</h1>
			<RetryButton loading={prop.retrying} onRetry={prop.onRetry} />
		</div>
	);
}
