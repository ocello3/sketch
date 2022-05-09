export const setLineParams = (params) => {
	const line = {};
	line.maxNum = 200;
	line.maxStrokeWeight = 8;
	line.maxDiameter = params.size / 2;
	line.angleSpeed = Math.PI * 0.002;
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
	lines.baseAngle = 0;
	lines.dataArray = Array.from(Array(lines.num), () => setData(s));
	return lines;
}

const updateData = (index) => (angleInterVal, baseAngle, diameter, mouseY, params, s) => {
	const newData = {};
	const noisedDiameter = diameter * (0.7 + 0.3 * s.noise(index));
	const thisDiameter = (index%2 === 0)? noisedDiameter: noisedDiameter * 0.7;
	newData.centerPos = s.createVector(params.size*0.5, params.size*0.5);
	const calcEndPos = () => {
		const angle = angleInterVal * index + baseAngle;
		const x = newData.centerPos.x + thisDiameter * Math.cos(angle);
		const y = newData.centerPos.y + thisDiameter * Math.sin(angle);
		return s.createVector(x, y);
	}
	newData.endPos = calcEndPos();
	newData.strokeWeight = s.map(mouseY, 0, params.size, 1, params.line.maxStrokeWeight);
	return newData;
}

export const updateLines = (preLines, mouseX, mouseY, params, s) => {
	const newLines = {};
	const calcNum = () => {
		const floatNum = s.map(mouseY, 0, params.size, 1, params.line.maxNum);
		const constrainedNum = (floatNum > 1)? floatNum: 1;
		return Math.floor(constrainedNum);
	}
	newLines.num = calcNum();
	newLines.baseAngle = preLines.baseAngle + params.line.angleSpeed;
	const angleInterVal = 2 * Math.PI / newLines.num;
	const diameter = s.map(mouseX, 0, params.size, 0, params.line.maxDiameter);
	newLines.dataArray = Array.from(Array(newLines.num), (_, index) => updateData(index)(angleInterVal, newLines.baseAngle, diameter, mouseY, params, s));
	return newLines;
};

const drawLine = (data, params, s) => {
	s.push();
	s.strokeWeight(data.strokeWeight);
	s.curveVertex(data.endPos.x, data.endPos.y);
	s.line(data.centerPos.x, data.centerPos.y, data.endPos.x, data.endPos.y);
	s.pop();
	return false;
}

export const drawLines = (lines, params, s) => {
	s.push();
	// s.noFill();
	s.beginShape();
	s.curveVertex(lines.dataArray.slice(-1)[0].endPos.x, lines.dataArray.slice(-1)[0].endPos.y);
	for (const data of lines.dataArray) drawLine(data, params, s);
	s.curveVertex(lines.dataArray[0].endPos.x, lines.dataArray[0].endPos.y);
	if (lines.num != 1) s.curveVertex(lines.dataArray[1].endPos.x, lines.dataArray[1].endPos.y);
	s.endShape();
	s.pop();
	return false;
}
