import { test, getParams, setObj, updateObj } from './calc.js';
import { gui } from './gui.js';

let params;
let objs;
let img;

const thisPreload = s => {
	img = s.loadImage('../../../image/IMG_0020.jpeg');
	if (img.width > img.height) img.resize(img.width, 0);
	if (img.width <= img.height) img.resize(0, img.height);
}

const thisSetup = s => {
	params = getParams();
	s.createCanvas(params.size, params.size);
	const totalNum = params.num * params.num;
	objs = Array.from(Array(totalNum), (obj, index) => setObj(index)(params, img));
	gui(params);
	test();
}

const thisDraw = s => {
	objs = objs.map((obj, index) => updateObj(obj, index));
	// s.noLoop();
	s.background(255);
	// frame
	s.push();
	s.noFill();
	s.stroke(0);
	s.rect(0, 0, params.size);
	s.pop();
	// image
	s.image(img, 0, 0);
	// text
	s.push();
	s.erase(50);
	s.textSize(10);
	s.textAlign(s.CENTER);
	// s.fill(0);
	objs.forEach((obj, index) => {
		s.fill(obj.color);
		s.text(obj.text, obj.pos.x, obj.pos.y);
	});
	s.pop();
}

const sketch = s => {
	s.preload = () => thisPreload(s);
	s.setup = () => thisSetup(s);
	s.draw = () => thisDraw(s);
}
export const s = new p5(sketch, 'sketch');
