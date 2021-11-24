import { setParams, updateParams, gui } from './params.js';
import { setDot, updateDot } from './dot.js';
import { setPoly, updatePoly, testUpdatedPoly } from './poly.js';

let params;
let grid;
let polys;
let img;

const thisPreload = s => {
	img = s.loadImage('../image/IMG_0020.jpeg');
	if (img.width > img.height) img.resize(img.width, 0);
	if (img.width <= img.height) img.resize(0, img.height);
}

const thisSetup = s => {
	s.noiseSeed(90);
	params = setParams();
	s.createCanvas(params.size, params.size);
	const totalNum = params.num * params.num;
	grid = Array.from(Array(totalNum), (dot, index) => setDot(index)(params, img));
	polys = setPoly(params, grid);
	gui(params);
}

const thisDraw = s => {
	// update
	updateParams(params);
	grid = grid.map((dot) => updateDot(dot)(params));
	s.background(255);
	// frame
	s.push();
	s.noFill();
	s.stroke(0);
	s.rect(0, 0, params.size);
	s.pop();
	// image
	// s.image(img, 0, 0);
	// text
	s.push();
	s.textSize(10);
	s.textAlign(s.CENTER);
	// s.fill(0);
	grid.forEach((dot, index) => {
		s.noStroke();
		s.fill(dot.color);
		const size = dot.size * dot.noise * 2.5;
		s.rect(dot.pos.x, dot.pos.y, size, size, 3);
	});
	s.pop();
	// test
	s.noLoop();
	testUpdatedPoly();
}

const sketch = s => {
	s.preload = () => thisPreload(s);
	s.setup = () => thisSetup(s);
	s.draw = () => thisDraw(s);
}
export const s = new p5(sketch, 'sketch');
