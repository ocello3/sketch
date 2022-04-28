export const setLineParams = (params) => {
	const line = {};
	line.pgWidth = params.size;
	line.pgHeight = params.size/2;
	line.widthRate = 0.1;
	line.num = Math.floor(line.pgWidth * line.widthRate);
	line.layer = 2;
	params.line = line;
}

export const setLinePgs = (params, pgs, s) => {
	const pg = s.createGraphics(params.line.pgWidth, params.line.pgHeight);
	const pgArray = [pg, pg];
	pgs.lines = {
		above: pgArray,
		below: pgArray,
	}
}

const setLine = (index) => (params, s, pgIndex, side, widths) => {
	const line = {};
	line.width = widths[index];
	line.height = params.line.pgHeight;
	const calcXPos = () => {
		const accWidths = widths.slice(0, index);
		return accWidths.reduce((pre, cur) => pre + cur, 0);
	}
	line.pos = s.createVector(calcXPos(), 0);
	const calcColor = () => {
		const alpha = 150 / params.line.num * index;
		if (side === 'above') return s.color(255, 0, 0, alpha);
		if (side === 'below') return s.color(0, 0, 255, alpha);
		throw `${side}`;
	}
	line.color = calcColor();
	return line;
}

export const setLines = (params, s) => (side) => (pgIndex) => {
	const widths = Array.from(Array(params.line.num), () => params.line.pgWidth/params.line.num);
	return Array.from(Array(params.line.num), (_, index) => setLine(index)(params, s, pgIndex, side, widths));
}

const drawLines = (pg, pgIndex, lines) => {
	const thisLines = lines(pgIndex);
	thisLines.forEach(line => {
		pg.push();
		pg.noStroke();
		pg.fill(line.color);
		pg.rect(line.pos.x, line.pos.y, line.width, line.height);
		pg.pop();
	});
	return false;
}

export const drawLinePgs = (params, pgs, lines, s) => {
	pgs.lines.above.forEach((pg, pgIndex) => {
		const thisLines = lines('above');
		drawLines(pg, pgIndex, thisLines);
		s.image(pg, 0, 0);
	});
	pgs.lines.below.forEach((pg, pgIndex) => {
		const thisLines = lines('below');
		drawLines(pg, pgIndex, thisLines);
		s.image(pg, 0, params.size/2);
	});
	return false;
}
