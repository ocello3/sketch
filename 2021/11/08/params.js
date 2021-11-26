import { s } from './sketch.js';

export const setParams = () => {
	const canvasDiv = document.getElementById('sketch');
	return {
		frameCount: 0,
		frameRate: 0,
		size: canvasDiv.clientWidth,
	}
}

export const updateParams = (params) => {
	params.frameCount += 1;
	params.frameRate = s.frameRate();
}

export const gui = params => {
	const pane = new Tweakpane.Pane({ container: document.getElementById('pane') });
	pane.addMonitor(params, 'frameRate', {interval: 500});
}
