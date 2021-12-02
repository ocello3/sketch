import { setParams, testSetParams, updateParams, gui } from './params.js';
import { setFonts, testSetFonts } from './font.js';
import { setPhrase, testSetPhrase } from './phrase.js';
import { drawOutline } from './outline.js';

let params;
let fonts;
let phrase;

const thisPreload = s => {
	params = {
		font: s.loadFont('../../../font/HelveticaNeue-Regular.otf'),　
	}
}

const testSetup = () => {
	testSetParams(params);
	testSetFonts(fonts);
	testSetPhrase(phrase, params);
}

const thisSetup = s => {
	setParams(params);
	fonts = setFonts(params);
	phrase = setPhrase(fonts, params);
	gui(params);
	s.createCanvas(params.size, params.size);
	testSetup();
}

const testDraw = () => {
	s.noLoop();
}

const thisDraw = s => {
	s.background(255);
	// updateParams(params);
	/* frame */
	s.push();
	s.noFill();
	s.stroke(0);
	s.rect(0, 0, params.size, params.size);
	s.pop();
	// update
	
	// scroll pos
	// s.scale(1, params.multRate);
	// s.fill(255 - 255 * params.multRate);
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
	drawOutline(fonts, phrase, params);
	testDraw();
}

const sketch = s => {
	s.preload = () => thisPreload(s);
	s.setup = () => thisSetup(s);
	s.draw = () => thisDraw(s);
}
export const s = new p5(sketch, 'sketch');
