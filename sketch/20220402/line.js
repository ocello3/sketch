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
	const fullPg = s.createGraphics(params.line.pgWidth, params.line.pgHeight);
	const halfPg = s.createGraphics(params.line.pgWidth, Math.ceil(params.line.pgHeight/2));
	const pgSet = new Map([['full', fullPg], ['half', halfPg]]);
	pgs.lines = new Map([['above', pgSet], ['below', pgSet]]);
}

const setLine = (lineIndex) => (params, s, pgSize, pgSide, widths) => {
	const line = {};
	line.width = widths[lineIndex];
	const calcHeight = () => {
		if (pgSize === 'full') return params.line.pgHeight;
		if (pgSize === 'half') return params.line.pgHeight/2;
		throw `${pgSize}`
	}
	line.height = calcHeight();
	const calcXPos = () => {
		const accWidths = widths.slice(0, lineIndex);
		return accWidths.reduce((pre, cur) => pre + cur, 0);
	}
	line.pos = s.createVector(calcXPos(), 0);
	const calcColor = () => {
		const alpha = 150 / params.line.num * lineIndex;
		if (pgSide === 'above') return s.color(255, 0, 0, alpha);
		if (pgSide === 'below') return s.color(0, 0, 255, alpha);
		throw `${side}`;
	}
	line.color = calcColor();
	return line;
}

export const setLines = (params, s) => (pgSide) => (pgSize) => {
	const widths = Array.from(Array(params.line.num), () => params.line.pgWidth/params.line.num);
	return Array.from(Array(params.line.num), (_, lineIndex) => setLine(lineIndex)(params, s, pgSize, pgSide, widths));
}

const drawLines = (pg, pgSize, lines) => {
	const thisLines = lines(pgSize);
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
	for (const [pgSide, pgSet] of pgs.lines) {
		const thisLines = lines(pgSide);
		const calcYPos = () => {
			if (pgSide === 'above') return 0;
			if (pgSide === 'below') return params.size/2;
			throw `${pgSide}`;
		}
		const yPos = calcYPos();
		for (const [pgSize, pg] of pgSet) {
			drawLines(pg, pgSize, thisLines);
			s.image(pg, 0, yPos);
		}
	}
	return false;
}
