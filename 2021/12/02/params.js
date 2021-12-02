import { s } from './sketch.js';

export const setParams = (params) => {
	// scroll setting for ios safari
	window.onscroll = function () {
		if (document.body.scrollHeight == window.innerHeight + window.pageYOffset) {
			window.focus();
		}
	}
	// calc params
	params.canvasDiv = document.getElementById('sketch');
	params.size = params.canvasDiv.clientWidth;
	params.scrollTop = 0;
	params.scrollmax = 200;
	params.multRate = 1;
	// font info
	params.fontSize = 90;
	params.text = 'Sketch List';
	params.sampleFactor = 0.03;
	params.simplifyThreshold = 0;
}

export const testSetParams = (params) => {
	const isParamsSize = params.size > 0;
	console.assert(isParamsSize, params.size);
}

export const updateParams = (params) => {
	params.scrollTop = params.canvasDiv.scrollTop || document.body.scrollTop || window.pageYOffset;
	params.multRate = (params.scrollmax - params.scrollTop) / params.scrollmax; // top: 1, bottom: 0
}

export const gui = params => {
	const pane = new Tweakpane.Pane({ container: document.getElementById('pane') });
	pane.addMonitor(params, 'scrollTop', {interval: 500});
	pane.addInput(params,'sampleFactor', { sptep: 1 });
}
