import { setParams, updateParams, gui } from '../../util/params.js';
import { drawFrame } from '../../util/drawFrame.js';
import { debug } from '../../util/debug.js'; // obj, length=null, start=0
import { setCheckboxParams, calcCheckboxObj, updateCheckboxDoms } from './checkbox.js';
// import { setSynth, playSynth } from './synth.js';

const sketch = s => {
	let params; // size
	let checkboxObj = { isInit: true };
	let checkboxDoms;
	// let synth;
	s.setup = () => {
		params = setParams();
		s.createCanvas(params.size, params.size);
		// tab.pages[0].addInput(params, 'margin');
		const tab = gui(s, params, false, false); // audio, seq
		setCheckboxParams(params, tab);
		checkboxDoms = Array.from(Array(Math.pow(params.checkbox.pieceNum, 2)), () => s.createCheckbox());
		// synth = setSynth(params, tab);
		s.noLoop();
		// s.frameRate(10);
	};
	s.draw = () => {
		s.background(255);
		drawFrame(s, params);
		checkboxObj = calcCheckboxObj(checkboxObj, params, s,);
		// debug(circleObj);
		updateCheckboxDoms(checkboxDoms, checkboxObj, params, s);
		updateParams(s, params);
		// playSynth(circleObj, synth, params, s);
	};
}
new p5(sketch, 'sketch');
