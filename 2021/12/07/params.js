import { s } from './sketch.js';

export const setParams = () => {
	const params = {};
	// default
	params.isPlay = false;
	params.frameRate = 0;
	params.canvasDiv = document.getElementById('sketch');
	params.size = params.canvasDiv.clientWidth;
	// tone
	params.meter = new Tone.Meter({ normalRange: false });
	Tone.Destination.connect(params.meter);
	params.mute = false;
	params.volume = 0;
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
	if (s.frameCount%10 === 0) params.volume = params.meter.getValue();;
}	

const activate = (params) => {
	// synths.forEach(synth => synth.start();
	Tone.start();
	Tone.Destination.mute = params.mute;
	// Tone.Transport.start();
	params.isPlay = true;
	s.loop();
}

const inactivate = (params) => {
	// Tone.Transport.stop();
	params.isPlay = false;
	s.noLoop();
}
const reactivate = (params) => {
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
	tab.pages[0].addButton({ title: 'on/off', label: 'play' }).on('click', () => {
		const isInit = !s.isLooping() && !params.isPlay;
		const isPlay = s.isLooping();
		const isPause = !s.isLooping() && params.isPlay;
		if (isInit) activate(params);
		if (isPlay) inactivate(params);
		if (isPause) reactivate(params);
	});
	tab.pages[0].addInput(params, 'mute').on('change', (event) => {
		Tone.Destination.mute = event.value;
	});
	tab.pages[0].addMonitor(params, 'volume');
	tab.pages[0].addMonitor(params, 'isPlay');
	tab.pages[0].addMonitor(params, 'frameRate', { interval: 500 });
}
