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
		isEnded: [false, false, false, false],
		rate: {
			play: {
				min: 0.5,
				max: 1.5,
			},
			reverse: {
				min: 0.2,
				max: 0.8,
			},
		}
	};
};