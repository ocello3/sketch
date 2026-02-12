import { setParams, updateParams, gui } from './params.js';
import { drawFrame } from './drawFrame.js';
import { debug } from './debug.js'; // obj, length=null, start=0
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
		s.noLoop();
		// s.frameRate(2);
	};
	s.draw = () => {
		s.background(255);
		drawFrame(s, params);
		circleObj = calcCircleObj(circleObj, params, s, s.mouseX, s.mouseY);
		// debug(circleObj.grids[0]);
		drawCircleObj(circleObj, s);
		updateParams(s, params);
		// playSynth(balls, synth);
	};
}
new p5(sketch, 'sketch');
