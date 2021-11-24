import { test, getParams, setObj, updateObj } from './calc.js';
import { gui } from './gui.js';

let params;
let objs;

const thisSetup = s => {
	params = getParams();
	s.createCanvas(params.size, params.size);
	objs = Array.from(Array(params.num), (obj, index) => setObj(index)(params));
	gui(params);
	test();
}

const thisDraw = s => {
	objs = objs.map((obj, index) => updateObj(obj, index));
	s.noLoop();
	s.background(255);
	// frame
	s.push();
	s.noFill();
	s.stroke(0);
	s.rect(0, 0, params.size);
	s.pop();
	// text
	s.push();
	s.textSize(20);
	s.textAlign(s.CENTER);
	s.fill(0);
	objs.forEach((obj, index) => {
		s.text(obj.text, obj.pos.x, obj.pos.y);
	});
	s.pop();
}

const sketch = s => {
	s.setup = () => thisSetup(s);
	s.draw = () => thisDraw(s);
}
export const s = new p5(sketch, 'sketch');
