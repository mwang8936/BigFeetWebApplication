import { v4 as uuidv4 } from 'uuid';

export const useDeviceInfo = () => {
	let deviceId = localStorage.getItem('device_id');
	if (!deviceId) {
		deviceId = uuidv4();
		localStorage.setItem('device_id', deviceId as string);
	}
	const deviceName = navigator.userAgent;
	const deviceModel = navigator.platform || 'Unknown';

	return { deviceId, deviceName, deviceModel };
};
