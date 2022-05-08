import { setParams, updateParams, gui } from '../../util/params.js';
import { drawFrame } from '../../util/drawFrame.js';
import { debug } from '../../util/debug.js'; // obj, length=null, start=0
import { setLineParams, setLines, updateLines, drawLines } from './line.js';
// import { setSynth, playSynth } from './synth.js';

const sketch = s => {
	let params; // size
	let lines;
	// let synth;
	s.setup = () => {
		params = setParams();
		s.createCanvas(params.size, params.size);
		setLineParams(params);
		lines = setLines(s);
		// tab.pages[0].addInput(params, 'margin');
		const tab = gui(s, params, false, false); // audio, seq
		// synth = setSynth();
		s.noLoop();
		// s.frameRate(10);
	};
	s.draw = () => {
		s.background(255);
		lines = updateLines(lines, s.mouseX, s.mouseY, params, s);
		debug(lines.dataArray, 1);
		drawFrame(s, params);
		drawLines(lines, params, s)
		updateParams(s, params);
		// playSynth(balls, synth);
	};
}
new p5(sketch, 'sketch');
