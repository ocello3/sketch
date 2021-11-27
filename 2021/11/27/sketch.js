import { setParams, updateParams, gui } from './params.js';
// import { setDot, updateDot } from './dot.js';

let params;

const testSetup = () => {
}

const thisSetup = s => {
	params = setParams();
	s.createCanvas(params.size, params.size);
	gui(params);
	testSetup();
}

const testDraw = () => {
	s.noLoop();
}

const thisDraw = s => {
	s.background(255);
	// frame
	s.push();
	s.noFill();
	s.stroke(0);
	s.rect(0, 0, params.size);
	s.pop();
	// draw text
	s.push();
	s.noFill();
	s.stroke(0);
	s.textAlign(s.LEFT, s.CENTER);
	s.textSize(params.size*0.2);
	s.text('Sketch List', 0, params.size/2)
	s.pop();
}

const sketch = s => {
	s.setup = () => thisSetup(s);
	s.draw = () => thisDraw(s);
}
export const s = new p5(sketch, 'sketch');
