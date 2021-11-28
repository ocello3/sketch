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
	// font info
	params.fontSize = 1;
	params.text = 'Sketch List';
	params.fonts = Array.from(Array(params.text.length), (obj, index) => {
		const thisChar = params.text.substr(index, 1); // get char from text
		const points = params.font.textToPoints(thisChar, 0, 0, params.fontSize, { // x, y - coordinate
			sampleFactor: 5, // higher values yield more points
			simplifyThreshold: 0, // if set to a non-zero value, collinear points will be be removed from the polygon
		});
		const bounds = params.font.textBounds(thisChar, 0, 0, params.fontSize);
		return {
			points: points,
			bounds: bounds,
		}
	});
}

export const gui = params => {
	const pane = new Tweakpane.Pane({ container: document.getElementById('pane') });
	pane.addMonitor(params, 'scrollTop', {interval: 500});
}
