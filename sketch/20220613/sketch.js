import { setParams, updateParams, gui } from '../../util/params.js';
import { drawFrame } from '../../util/drawFrame.js';
import { debug } from '../../util/debug.js'; // obj, length=null, start=0
import { flooder } from './flooder.js';
// import { setSynth, playSynth } from './synth.js';

const sketch = s => {
	let params; // size
	let flooderObj;
	// let synth;
	s.setup = () => {
		params = setParams();
		s.createCanvas(params.size, params.size);
		const tab = gui(s, params, false, false); // audio, seq
		// tab.pages[0].addInput(params, 'margin');
		flooderObj = flooder.init(params, s, tab);
		// synth = setSynth(params, tab);
		s.noLoop();
		// s.frameRate(10);
		s.background(255);
	};
	s.draw = () => {
		s.background(255);
		// text
		flooderObj = flooder.update(flooderObj, params, s);
		flooder.draw(flooderObj, params, s);
		debug(flooderObj);
		drawFrame(s, params);
		updateParams(s, params);
		// playSynth(flooderObj, synth, params, s);
	};
}
new p5(sketch, 'sketch');
