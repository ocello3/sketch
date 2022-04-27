const setParams = (params) => {
	const line = {};
	line.pgWidth = params.size;
	line.pgHeight = params.size/2;
	line.widthRate = 0.1;
	line.num = Math.floor(line.pgWidth * line.widthRate);
	params.line = line;
}

const setLine = (index) => (params, s, widths) => {
	const line = {};
	line.width = widths[index];
	line.height = params.line.pgHeight;
	const calcXPos = () => {
		const accWidths = widths.slice(0, index + 1);
		return accWidths.reduce((pre, cur) => pre + cur, 0);
	}
	line.pos = s.createVector(calcXPos(), 0);
	line.color = 255/params.line.num * index;
	return line;
}

export const setLines = (params, s) => {
	setParams(params);
	const widths = Array.from(Array(params.line.num), () => params.line.pgWidth/params.line.num);
	return Array.from(Array(params.line.num), (_, index) => setLine(index)(params, s, widths));
}

export const drawLines = (s, lines) => {
	lines.forEach(line => {
		s.push();
		s.noStroke();
		s.fill(line.color);
		s.rect(line.pos.x, line.pos.y, line.width, line.height);
		s.pop();
	});
	return false;
}
