import { setParams, gui } from './params.js';
import { drawOutline } from './outline.js';

let params;

const thisPreload = s => {
	params = {
		font: s.loadFont('../../../font/HelveticaNeue-Regular.otf'),　
	}
}

const testSetup = () => {
}

const thisSetup = s => {
	setParams(params);
	gui(params);
	s.createCanvas(params.size, params.size);
	testSetup();
}

const testDraw = () => {
	s.noLoop();
}

const thisDraw = s => {
	s.background(255);
	/* frame
	s.push();
	s.noFill();
	s.stroke(0);
	s.rect(0, 0, params.size, params.size);
	s.pop(); */
	// update
	params.scrollTop = params.canvasDiv.scrollTop || document.body.scrollTop || window.pageYOffset;
	const multRate = (params.scrollmax - params.scrollTop) / params.scrollmax; // top: 1, bottom: 0
	// scroll pos
	// s.scale(1, multRate);
	// s.fill(255 - 255 * multRate);
	// font
	/*
	s.push();
	s.textSize(34);
	s.textFont(params.font);
	s.textAlign(s.LEFT, s.CENTER);
	s.text(params.text, 0, params.size/2);
	s.pop();
	*/
	// draw font points
	drawOutline(params);
	// testDraw();
}

const sketch = s => {
	s.preload = () => thisPreload(s);
	s.setup = () => thisSetup(s);
	s.draw = () => thisDraw(s);
}
export const s = new p5(sketch, 'sketch');
