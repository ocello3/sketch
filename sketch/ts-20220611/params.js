// params.js
export const getParams = () => {
	const num = 10;
	return {
		// defaults
		play: false,
		isInit: true,
		vol: 0,
		frameRate: 0,
		debugMode: true, // single point to toggle safety checks

		// sketch
		mover: {
			num: num,
			gravity: 9.8,
			windF: 5,
			massMin: 10,
			massMax: 20,
			velXmax: 5,
			velYmax: 5,
			bufferRate: 0.95,
			bufferRateMin: 0.9,
			fontSizeRate: 0.007,
		},
		wind: {
			num: num,
			lengthMin: 10,
			lengthMax: 30,
			gravityRate: 2,
			windRate: 10,
			bufferAdjustRate: 5,
			bufferBaseRate: 0.1,
		}
	};
};