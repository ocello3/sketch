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
		barSizeRate: 0.2,
		laps: 5,
		radiusRate: 0.1,
		// sound
		// cutoff: 10000,
		// resononce: 1,
	};
};