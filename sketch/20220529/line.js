export const setLineParams = (params, tab) => {
	params.line = {
		interval: 2.16,
		gapRate: 7.36,
		weight: 0.5,
		alpha: 200,
	}
	tab.pages[1].addInput(params.line, 'interval', { min: 0, max: 5 });
	tab.pages[1].addInput(params.line, 'gapRate', { min: 0, max: 20 });
	tab.pages[1].addInput(params.line, 'weight', { min: 0, max: 2 });
	tab.pages[1].addInput(params.line, 'alpha', { min: 100, max: 255 });
	return false;
}

export const calcLineObj = (preLineObj, params, s) => {
	const newLineObj = { ...preLineObj };
	const isInit = (s.frameCount === 0);
	if (isInit) {
		
		// preLineObj.lines = Array.from(Array(newLineObj.num), () => 1);
	}
	newLineObj.num = Math.floor(params.size / params.line.interval);
	newLineObj.num = Math.floor(params.size / params.line.interval);
	newLineObj.lines = Array.from(Array(newLineObj.num), (_, lineIndex) => {
		const newLine = {};
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
	s.blendMode(s.MULTIPLY);
	for (const line of lineObj.lines) {
		s.strokeWeight(params.line.interval * params.line.weight);
		s.stroke(111, 208, 140, params.line.alpha);
		s.line(line.startPos.x, line.startPos.y, line.startPos.x, line.endPos.y);
		s.stroke(123, 158, 168, params.line.alpha);
		s.line(line.startPos.x, line.startPos.y, line.endPos.x, line.endPos.y);
		s.stroke(205, 223, 160, params.line.alpha);
		s.curve(
			line.startPos.x, line.endPos.y * 0.5,
			line.startPos.x, line.startPos.y,
			line.endPos.x, line.endPos.y,
			line.endPos.x, line.endPos.y * 0.5
			);
	}
	s.pop();
}