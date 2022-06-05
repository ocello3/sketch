import { setParams, updateParams, gui } from '../../util/params.js';
import { drawFrame } from '../../util/drawFrame.js';
import { debug } from '../../util/debug.js'; // obj, length=null, start=0
import { plotter } from './plotter.js';
// import { setSynth, playSynth } from './synth.js';

const sketch = s => {
	let params; // size
	let plotterObj;
	// let synth;
	s.setup = () => {
		params = setParams();
		s.createCanvas(params.size, params.size);
		const tab = gui(s, params, false, false); // audio, seq
		// tab.pages[0].addInput(params, 'margin');
		plotterObj = plotter.init(params, tab, s);
		// synth = setSynth(params, tab);
		s.noLoop();
		// s.frameRate(10);
	};
	s.draw = () => {
		s.background(255, 100);
		// text
		plotterObj = plotter.update(plotterObj, params, s);
		plotter.draw(plotterObj, params, s);
		// debug(plotterObj);
		drawFrame(s, params);
		updateParams(s, params);
		// playSynth(walkerObj, synth, params, s);
	};
}
new p5(sketch, 'sketch');
