// params.js
export const getParams = () => {
	return {
		// defaults
		play: false,
		isInit: true,
		vol: 0,
		frameRate: 0,
		debugMode: true, // single point to toggle safety checks

		// sketch
		barSizeRate: 0.4,
		laps: 5,
		radiusRate: 0.1,
		rotateVel: 0.02,
		// sound
		res: 20,
		freq: 8000,
	};
};