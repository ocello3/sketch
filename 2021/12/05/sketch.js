import { setParams, testSetParams, updateParams, gui } from './params.js';

let params;
let tempNum = 0;

const testSetup = () => {
	testSetParams(params);
}

const startAudio = () => {
	const initAudioContext = () => {
		document.removeEventListener('touchstart', initAudioContext);
		Tone.start();
	}
	document.addEventListener('touchstart', initAudioContext);
}

const thisSetup = s => {
	params = setParams();
	gui(params);
	s.createCanvas(params.size, params.size);
	// tmp
	startAudio();
	// test
	testSetup();
}

const testDraw = () => {
	s.noLoop();
}

const thisDraw = s => {
	s.background(255);
	// update
	updateParams(params);
	// draw frame
	s.push();
	s.noFill();
	s.stroke(0);
	s.rect(0, 0, params.size, params.size);
	s.pop();
	// draw num for test
	if (s.frameCount % 60 === 0) {
		tempNum += 1;
		params.synth.triggerAttackRelease("C4", "16n");
	}
	s.textSize(params.size / 4);
	s.textAlign(s.CENTER, s.CENTER);
	s.text(tempNum, s.width / 2, s.height / 2);
	// test
	if (s.frameCount === 1) testDraw();
}

const sketch = s => {
	s.setup = () => thisSetup(s);
	s.draw = () => thisDraw(s);
}
export const s = new p5(sketch, 'sketch');
