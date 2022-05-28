export const setLineParams = (params, tab) => {
	params.line = {
		interval: 2,
		gapRate: 7,
	}
	tab.pages[1].addInput(params.line, 'gapRate', { min: 0, max: 10 });
	return false;
}

export const calcLineObj = (preLineObj, params, s) => {
	const newLineObj = { ...preLineObj };
	if (preLineObj.isInit) {
		newLineObj.isInit = false;
		newLineObj.num = Math.floor(params.size / params.line.interval);
		preLineObj.lines = Array.from(Array(newLineObj.num), () => 1);
	}
	newLineObj.lines = preLineObj.lines.map((preLine, lineIndex) => {
		const newLine = { ...preLine };
		newLine.startPos = (() => {
			const x = params.line.interval * lineIndex - params.line.gapRate;
			const y = 0;
			return s.createVector(x, y);
		})();
		newLine.endPos = (() => {
			const x = params.line.interval * lineIndex + params.line.gapRate;
			const y = params.size;
			return s.createVector(x, y);

		})();
		return newLine;
	});
	return newLineObj;
}

export const drawLine = (lineObj, params, s) => {
	s.push();
	for (const line of lineObj.lines) {
		s.strokeWeight(params.line.interval * 0.5);
		s.stroke(111, 208, 140, 200);
		s.line(line.startPos.x, line.startPos.y, line.startPos.x, line.endPos.y);
		s.stroke(123, 158, 168, 200);
		s.line(line.startPos.x, line.startPos.y, line.endPos.x, line.endPos.y);
	}
	s.pop();
}