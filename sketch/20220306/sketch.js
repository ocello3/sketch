import { setParams, updateParams, gui } from '../../util/params.js';
import { drawFrame } from '../../util/drawFrame.js';
import { debug } from '../../util/debug.js'; // obj, length=null, start=0
import { setBalls, updateBalls, drawBall } from './ball.js';
// import { setSynth, playSynth } from './synth.js';

let params; // size
let balls;
// let synth;

const setup = s => {
	params = setParams();
	s.createCanvas(params.size, params.size);
	// tab.pages[0].addInput(params, 'margin');
	const tab = gui(s, params, false, false); // audio, seq
	balls = setBalls(s, params);
	// synth = setSynth();
	s.noLoop();
	// s.frameRate(2);
}

const draw = s => {
	// s.background(255);
	// playSynth(ball, synth);
	drawBall(s, balls, params);
	debug(balls, 1);
	drawFrame(s, params);
	updateParams(s, params);
	balls = updateBalls(balls, s, params);
}

const sketch = s => {
	s.setup = () => setup(s);
	s.draw = () => draw(s);
}
new p5(sketch, 'sketch');
