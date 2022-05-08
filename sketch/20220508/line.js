export const setLineParams = (params) => {
	const line = {};
	line.maxNum = 360;
	line.maxStrokeWeight = 8;
	line.maxDiameter = params.size / 2;
	params.line = line;
}

const setData = (s) => {
	const data = {};
	data.centerPos = s.createVector(0, 0);
	data.endPos = s.createVector(0, 0);
	data.strokeWeight = 1;
	return data;
}

export const setLines = (s) => {
	const lines = {};
	lines.num = 1;
	lines.dataArray = Array.from(Array(lines.num), () => setData(s));
	return lines;
}

const updateData = (index) => (angleInterVal, diameter, mouseY, params, s) => {
	const newData = {};
	newData.centerPos = s.createVector(params.size*0.5, params.size*0.5);
	const calcEndPos = () => {
		const x = newData.centerPos.x + diameter * Math.cos(angleInterVal * index);
		const y = newData.centerPos.y + diameter * Math.sin(angleInterVal * index);
		return s.createVector(x, y);
	}
	newData.endPos = calcEndPos();
	newData.strokeWeight = s.map(mouseY, 0, params.size, 1, params.line.maxStrokeWeight);
	return newData;
}

export const updateLines = (preLines, mouseX, mouseY, params, s) => {
	// if (preLines.data[0].num === undefined) return preLines;
	const newLines = {};
	const calcNum = () => {
		// マウスのy座標で変化する
		const floatNum = s.map(mouseY, 0, params.size, 1, params.line.maxNum);
		return Math.floor(floatNum);
	}
	newLines.num = calcNum();
	const angleInterVal = 2 * Math.PI / newLines.num;
	const diameter = s.map(mouseX, 0, params.size, 0, params.line.maxDiameter);
	newLines.dataArray = Array.from(Array(newLines.num), (_, index) => updateData(index)(angleInterVal, diameter, mouseY, params, s));
	return newLines;
};

const drawLine = (data, params, s) => {
	s.push();
	s.strokeWeight(data.strokeWeight);
	s.line(data.centerPos.x, data.centerPos.y, data.endPos.x, data.endPos.y);
	s.pop();
	return false;
}

export const drawLines = (lines, params, s) => {
	for (const data of lines.dataArray) drawLine(data, params, s);
	return false;
}
