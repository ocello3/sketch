import { setParams, updateParams, gui } from '../../util/params.js';
import { drawFrame } from '../../util/drawFrame.js';
import { debug } from '../../util/debug.js'; // obj, length=null, start=0
import { setDropParams, setDrops, updateDrops, drawDrops } from './drop.js';
// import { setSynth, playSynth } from './synth.js';

const sketch = s => {
	let params; // size
	let drops;
	// let synth;
	s.setup = () => {
		params = setParams();
		s.createCanvas(params.size, params.size);
		// tab.pages[0].addInput(params, 'margin');
		const tab = gui(s, params, false, false); // audio, seq
		setDropParams(params);
		drops = setDrops(params, s)
		// synth = setSynth();
		s.noLoop();
		// s.frameRate(10);
	};
	s.draw = () => {
		s.background(255);
		debug(drops.dataArray, 1);
		drops = updateDrops(drops, params, s);
		drawFrame(s, params);
		drawDrops(drops, s);
		updateParams(s, params);
		// playSynth(balls, synth);
	};
}
new p5(sketch, 'sketch');
