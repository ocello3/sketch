import { setParams, updateParams, gui } from '../../util/params.js';
import { drawFrame } from '../../util/drawFrame.js';
import { debug } from '../../util/debug.js'; // obj, length=null, start=0
import { setLineParams, setLinePgs, setLines, drawLinePgs } from './line.js';
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
		setLineParams(params);
		setLinePgs(params, pgs, s);
		lines = setLines(params, s);
		// synth = setSynth();
		s.noLoop();
		// s.frameRate(2);
	};
	s.draw = () => { 
		drawLinePgs(params, pgs, lines, s);
		debug(lines('below')('half'), params.line.num);
		drawFrame(s, params);
		updateParams(s, params);
		// playSynth(balls, synth);
	};
}
new p5(sketch, 'sketch');
