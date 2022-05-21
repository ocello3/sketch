import { setParams, updateParams, gui } from '../../util/params.js';
import { drawFrame } from '../../util/drawFrame.js';
import { debug } from '../../util/debug.js'; // obj, length=null, start=0
import { setCheckboxParams, calcCheckboxObj } from './checkbox.js';
// import { setSynth, playSynth } from './synth.js';

const sketch = s => {
	let params; // size
	let checkboxObj = { isInit: true };
	// let synth;
	s.setup = () => {
		params = setParams();
		s.createCanvas(params.size, params.size);
		// tab.pages[0].addInput(params, 'margin');
		const tab = gui(s, params, false, false); // audio, seq
		setCheckboxParams(params, tab);
		// synth = setSynth(params, tab);
		s.noLoop();
		// s.frameRate(10);
	};
	s.draw = () => {
		s.background(255);
		drawFrame(s, params);
		checkboxObj = calcCheckboxObj(checkboxObj, params, s,);
		// debug(circleObj);
		updateParams(s, params);
		// playSynth(circleObj, synth, params, s);
	};
}
new p5(sketch, 'sketch');
