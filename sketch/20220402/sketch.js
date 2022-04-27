import { setParams, updateParams, gui } from '../../util/params.js';
import { drawFrame } from '../../util/drawFrame.js';
import { debug } from '../../util/debug.js'; // obj, length=null, start=0
import { setLines, drawLinePgs } from './line.js';
// import { setSynth, playSynth } from './synth.js';

const sketch = s => {
	let params; // size
	let lines;
	let pgs = {};
	// let synth;
	s.setup = () => {
		params = setParams();
		s.createCanvas(params.size, params.size);
		// tab.pages[0].addInput(params, 'margin');
		const tab = gui(s, params, false, false); // audio, seq
		lines = setLines(params, pgs, s);
		// synth = setSynth();
		s.noLoop();
		// s.frameRate(2);
	};
	s.draw = () => {
		s.background(255);
		drawLinePgs(params, pgs, lines, s);
		debug(lines, params.line.num);
		drawFrame(s, params);
		updateParams(s, params);
		// playSynth(balls, synth);
	};
}
new p5(sketch, 'sketch');
