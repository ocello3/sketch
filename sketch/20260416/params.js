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
		barSizeRate: 0.1,
		laps: 5,
		radiusRate: 0.1,
		// sound
		eq_1_low_gain: 0,
		eq_1_mid_gain: 0,
		eq_1_high_gain: 0,
		eq_1_low_freq: 0,
		eq_1_mid_freq: 0,
		eq_1_high_freq: 0,
	};
};