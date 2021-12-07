import { s } from './sketch.js';

export const setParams = () => {
	const params = {};
	// default
	params.isPlay = false;
	params.frameRate = 0;
	params.canvasDiv = document.getElementById('sketch');
	params.size = params.canvasDiv.clientWidth;
	params.synth = new Tone.MonoSynth({
		oscillator: {
			type: "square"
		},
		envelope: {
			attack: 0.1
		}
	}).toDestination();
	return params;
}

export const testSetParams = (params) => {
	const isParamsSize = params.size > 0;
	console.assert(isParamsSize, params.size);
}

export const updateParams = (params) => {
	params.frameRate = s.frameRate();
}	

const activate = (params) => {
	// synths.forEach(synth => synth.start();
	Tone.start(); // remove after add synths
	// Tone.Transport.start();
	params.isPlay = true;
	s.loop();
}

const inactivate = (params) => {
	Tone.Destination.mute = true;
	// Tone.Transport.stop();
	params.isPlay = false;
	s.noLoop();
}
const reactivate = (params) => {
	Tone.Destination.mute = false;
	// Tone.Transport.start();
	params.isPlay = true;
	s.loop();
}

export const gui = (params) => {
	const pane = new Tweakpane.Pane({ container: document.getElementById('pane') });
	const tab = pane.addTab({
		pages: [
			{title: 'default'},
			{title: 'detail'},
		],
	});
	const playBtn = tab.pages[0].addButton({ title: 'on/off' , label: 'play'});
	playBtn.on('click', () => {
		const isInit = !s.isLooping() && !params.isPlay;
		const isPlay = s.isLooping();
		const isPause = !s.isLooping() && params.isPlay;
		if (isInit) activate(params);
		if (isPlay) inactivate(params);
		if (isPause) reactivate(params);
	});
	tab.pages[0].addMonitor(params, 'isPlay');
	tab.pages[0].addMonitor(params, 'frameRate', { interval: 500 });
}
