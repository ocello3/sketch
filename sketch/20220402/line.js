const setParams = (params) => {
	const line = {};
	line.pgWidth = params.size;
	line.pgHeight = params.size/2;
	line.widthRate = 0.1;
	line.num = Math.floor(line.pgWidth * line.widthRate);
	line.layer = 2;
	params.line = line;
}

const setLine = (index) => (params, s, widths) => {
	const line = {};
	line.width = widths[index];
	line.height = params.line.pgHeight;
	const calcXPos = () => {
		const accWidths = widths.slice(0, index);
		return accWidths.reduce((pre, cur) => pre + cur, 0);
	}
	line.pos = s.createVector(calcXPos(), 0);
	line.color = 255/params.line.num * index;
	return line;
}

const setPgs = (params, pgs, s) => {
	const pg = s.createGraphics(params.line.pgWidth, params.line.pgHeight);
	const pgArray = [pg, pg];
	pgs.lines = {
		above: pgArray,
		below: pgArray,
	}
}

export const setLines = (params, pgs, s) => {
	setParams(params);
	setPgs(params, pgs, s);
	const widths = Array.from(Array(params.line.num), () => params.line.pgWidth/params.line.num);
	return Array.from(Array(params.line.num), (_, index) => setLine(index)(params, s, widths));
}

const drawLines = (pg, lines) => {
	lines.forEach(line => {
		pg.push();
		pg.noStroke();
		pg.fill(line.color);
		pg.rect(line.pos.x, line.pos.y, line.width, line.height);
		pg.pop();
	});
	return false;
}

export const drawLinePgs = (params, pgs, lines, s) => {
	pgs.lines.above.forEach((pg) => {
		drawLines(pg, lines);
		s.image(pg, 0, 0);
	});
	pgs.lines.below.forEach((pg) => {
		drawLines(pg, lines);
		s.image(pg, 0, params.size/2);
	});
	return false;
}
