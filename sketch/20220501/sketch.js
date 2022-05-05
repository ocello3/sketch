import { setParams, updateParams, gui } from '../../util/params.js';
import { drawFrame } from '../../util/drawFrame.js';
import { debug } from '../../util/debug.js'; // obj, length=null, start=0
import { setDropParams, setDrops, updateDrops, drawDrops } from './drop.js';
import { setRippleParams, setRipples, updateRipples } from './ripple.js';
// import { setSynth, playSynth } from './synth.js';

const sketch = s => {
	let params; // size
	let drops;
	let ripples;
	// let synth;
	s.setup = () => {
		params = setParams();
		s.createCanvas(params.size, params.size);
		// tab.pages[0].addInput(params, 'margin');
		const tab = gui(s, params, false, false); // audio, seq
		setDropParams(params);
		setRippleParams(params);
		drops = setDrops(params, s);
		ripples = setRipples(drops.dataArray, params, s);
		// synth = setSynth();
		s.noLoop();
		// s.frameRate(10);
	};
	s.draw = () => {
		s.background(255);
		debug(ripples.dataArray, 1);
		drops = updateDrops(drops, params, s);
		ripples = updateRipples(ripples, drops.dataArray);
		drawFrame(s, params);
		drawDrops(drops, s);
		updateParams(s, params);
		// playSynth(balls, synth);
	};
}
new p5(sketch, 'sketch');
