import { setParams, updateParams, gui } from '../../util/params.js';
import { drawFrame } from '../../util/drawFrame.js';
import { debug } from '../../util/debug.js'; // obj, length=null, start=0
import { setCheckboxParams, calcCheckboxObj, updateCheckboxDoms } from './checkbox.js';
import { setTextParams, calcTextObj, drawText } from './text.js';
// import { setSynth, playSynth } from './synth.js';

const sketch = s => {
	let params; // size
	let checkboxObj = { isInit: true };
	let textObj = { isInit: true };
	let checkboxDoms;
	let pg;
	// let synth;
	s.setup = () => {
		params = setParams();
		s.createCanvas(params.size, params.size);
		const tab = gui(s, params, false, false); // audio, seq
		pg = s.createGraphics(params.size, params.size);
		// tab.pages[0].addInput(params, 'margin');
		setTextParams(params, tab);
		setCheckboxParams(params, tab);
		checkboxDoms = Array.from(Array(Math.pow(params.checkbox.pieceNum, 2)), () => s.createCheckbox());
		checkboxDoms.forEach(checkboxDom => checkboxDom.style('transform', `scale(${params.checkbox.sizeRate * params.size})`));
		// pg.circle(params.size/2, params.size/2, params.size/2);
		// synth = setSynth(params, tab);
		s.noLoop();
		// s.frameRate(10);
	};
	s.draw = () => {
		s.background(255);
		textObj = calcTextObj(textObj, params, s);
		drawText(textObj, pg, params);
		checkboxObj = calcCheckboxObj(checkboxObj, params, s);
		// debug(circleObj);
		updateCheckboxDoms(pg, checkboxDoms, checkboxObj, params, s);
		// s.image(pg, 0, 0, params.size, params.size);
		drawFrame(s, params);
		updateParams(s, params);
		// playSynth(circleObj, synth, params, s);
	};
}
new p5(sketch, 'sketch');
