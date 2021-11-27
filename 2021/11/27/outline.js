import { s } from './sketch.js';

export const drawOutline = (params) => {
	s.push();
	s.noStroke();
	s.beginShape();
	s.translate(-params.bounds.x * params.size / params.bounds.w, -params.bounds.y * params.size / params.bounds.h);
	for (let i = 0; i < params.points.length; i++) {
		let p = params.points[i];
		s.vertex(
			p.x * params.size / params.bounds.w +
			Math.sin(20 * p.y / params.bounds.h + s.millis() / 1000) * params.size / 30,
			p.y * params.size / params.bounds.h
		);
	}
	s.endShape(s.CLOSE);
	s.pop();
}