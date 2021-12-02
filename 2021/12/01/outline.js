import { s } from './sketch.js';

export const drawOutline = (params) => {
	s.push();
	s.scale(0.05); // tmp
	s.fill(0); // tmp
	s.noStroke();
	s.beginShape();
	params.fonts.forEach((font, index) => {
		s.translate(params.fontWidthAccums[index], params.size / 2);
		font.points.forEach(point => {
			s.vertex(
			point.x * params.size / font.bounds.w * params.size / 30,
			point.y * params.size / font.bounds.h
			);
		});
	});
	s.endShape(s.CLOSE);
	s.pop();
}