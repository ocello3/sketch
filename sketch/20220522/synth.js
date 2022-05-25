const setSynthParams = (params, tab) => {
	params.synth = {
		volume: -5,
	};
	tab.pages[2].addInput(params.synth, 'volume', {step: 1, min: -60, max: 0});
	return false;
}

const setSampler = () => {
	return new Tone.Sampler({
		urls: {
			A0: 'caution.wav',
			A1: 'swipe_01.wav',
		},
		baseUrl: '../../sound/SND02_piano/',
	}).toDestination();
}

export const setSynth = (params, tab) => {
	setSynthParams(params, tab);
	const synth = {};
	synth.sampler = setSampler();
	synth.sampler.volume.value = params.synth.volume;
	return synth;
}

export const playSynth = (textObj, synth, params) => {
	if (textObj.isReset) {
		synth.sampler.triggerAttackRelease('A1', '32n');
		return false;
	} else if (textObj.isInit || textObj.isOver) {
		synth.sampler.triggerAttackRelease('A0', '32n');
		return false;
	}
}
