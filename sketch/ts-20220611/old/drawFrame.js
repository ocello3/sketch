export const drawFrame = (s, size) => {
	s.push();
	s.noFill();
	s.stroke(0);
	s.rect(0, 0, size, size);
	s.pop();
	return false;
};