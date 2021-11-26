import { setParams, updateParams, gui } from './params.js';
// import { setDot, updateDot } from './dot.js';

/*
アイデア
createGraphicsでテクスチャを作成して、塗りつぶしに利用する。
*/

let params;
let texture;

const testSetup = () => {
}

const thisSetup = s => {
	params = setParams();
	s.createCanvas(params.size, params.size, s.WEBGL);
	texture = s.createGraphics(params.size/2, params.size/2);
	gui(params);
	testSetup();
}

const testDraw = () => {
	s.noLoop();
}

const thisDraw = s => {
	// texture
	texture.push();
	texture.background(0);
	texture.fill(255);
	texture.stroke(0);
	for (let i = 0; i < 10; i++) {
		const size = texture.width/10;
		for (let j = 0; i < 10; i++) {
			texture.rect(i*10, j*10, size);
		}
	}
	texture.pop();
	s.texture(texture);
	s.rect(s.width/4, s.height/4, s.width/2);
	testDraw();
	// frame
	s.background(255);
	s.push();
	s.noFill();
	s.stroke(0);
	s.rect(0, 0, params.size);
	s.pop();
}

const sketch = s => {
	s.setup = () => thisSetup(s);
	s.draw = () => thisDraw(s);
}
export const s = new p5(sketch, 'sketch');
