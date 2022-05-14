import { setParams, updateParams, gui } from '../../util/params.js';
import { drawFrame } from '../../util/drawFrame.js';
import { debug } from '../../util/debug.js'; // obj, length=null, start=0
import { setCircleParams, calcCircleObj, drawCircleObj } from './circle.js';
// import { setSynth, playSynth } from './synth.js';

const sketch = s => {
	let params; // size
	let circleObj = { isInit: true };
	// let synth;
	s.setup = () => {
		params = setParams();
		s.createCanvas(params.size, params.size);
		setCircleParams(params);
		// tab.pages[0].addInput(params, 'margin');
		const tab = gui(s, params, false, false); // audio, seq
		// synth = setSynth();
		s.colorMode(s.HSB);
		s.noLoop();
		s.frameRate(2);
	};
	s.draw = () => {
		s.background(255);
		debug(circleObj);
		circleObj = calcCircleObj(circleObj, params, s);
		drawCircleObj(circleObj, s);
		drawFrame(s, params);
		updateParams(s, params);
		// playSynth(balls, synth);
	};
}
new p5(sketch, 'sketch');
