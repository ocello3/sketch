export const setLineParams = (params) => {
	const line = {};
	line.tileVNum = 3;
	line.tileHNum = 3;
	line.maxNum = 30;
	line.maxStrokeWeight = 8;
	line.maxDiameter = params.size / 2;
	line.angleSpeed = Math.PI * 0.002;
	params.line = line;
}

const calcLines = (lineNum, centerPos, diameter, angleInterval, baseAngle, mouseY, params, s) => {
	const newLines = Array.from(Array(lineNum), (_, lineIndex) => {
		const newLine = {};
		newLine.centerPos = centerPos;
		const noisedDiameter = diameter * (0.7 + 0.3 * s.noise(lineIndex));
		const thisDiameter = (lineIndex % 2 === 0) ? noisedDiameter : noisedDiameter * 0.7;
		const calcEndPos = () => {
			const angle = angleInterval * lineIndex + baseAngle;
			const x = centerPos.x + thisDiameter * Math.cos(angle);
			const y = centerPos.y + thisDiameter * Math.sin(angle);
			return s.createVector(x, y);
		}
		newLine.endPos = calcEndPos();
		newLine.strokeWeight = s.map(mouseY, 0, params.size, 1, params.line.maxStrokeWeight);
		return newLine;
	});
	return newLines;
};

const calcTiles = (isInit, preTiles, tileSize, mouseX, mouseY, params, s) => {
	const newTiles = preTiles.map((preTile, tileIndex) => {
		const newTile = {};
		const calcOriginPos = () => {
			const tileVIndex = tileIndex % params.line.tileVNum;
			const tileHIndex = Math.floor(tileIndex / params.line.tileVNum);
			const originX = tileVIndex * tileSize.x;
			const originY = tileHIndex * tileSize.y;
			return s.createVector(originX, originY);
		}
		newTile.originPos = isInit? calcOriginPos(): preTile.originPos;
		const calcLineNum = () => {
			const floatNum = s.map(mouseY, 0, params.size, 1, params.line.maxNum);
			const constrainedNum = (floatNum > 1) ? floatNum : 1;
			return Math.floor(constrainedNum);
		}
		newTile.lineNum = calcLineNum();
		newTile.diameter = s.map(mouseX, 0, params.size, 0, params.line.maxDiameter);
		newTile.angleInterval = 2 * Math.PI / newTile.lineNum;
		newTile.baseAngle = isInit? 0: preTile.baseAngle + params.line.angleSpeed;
		const calcCenterPos = () => {
			const relativeCenterPos = s.createVector(tileSize.x / 2, tileSize.y / 2);
			return p5.Vector.add(calcOriginPos(), relativeCenterPos);
		}
		const centerPos = calcCenterPos();
		newTile.lines = calcLines(newTile.lineNum, centerPos, newTile.diameter, newTile.angleInterval, newTile.baseAngle, mouseY, params, s);
		return newTile;
	});
	return newTiles;
}

export const calcLineObj = (preLineObj, mouseX, mouseY, params, s) => {
	const newLineObj = {};
	const isInit = (preLineObj === undefined);
	const calcTileSize = () => {
		const tileWidth = params.size / params.line.tileVNum;
		const tileHeight = params.size / params.line.tileHNum;
		return s.createVector(tileWidth, tileHeight);
	}
	newLineObj.tileSize = isInit? calcTileSize(): preLineObj.tileSize;
	const calcPreTiles = () => {
		const tileNum = params.line.tileVNum * params.line.tileHNum;
		return Array.from(Array(tileNum), () => 1);
	} 
	const preTiles = isInit? calcPreTiles(): preLineObj.tiles;
	newLineObj.tiles = calcTiles(isInit, preTiles, newLineObj.tileSize, mouseX, mouseY, params, s);
	return newLineObj;
}

const drawLine = (line, s) => {
	s.push();
	s.strokeWeight(line.strokeWeight);
	s.curveVertex(line.endPos.x, line.endPos.y);
	s.line(line.centerPos.x, line.centerPos.y, line.endPos.x, line.endPos.y);
	s.pop();
	return false;
}

const drawTile = (tile, s) => {
	s.push();
	// s.noFill();
	s.beginShape();
	if (tile.lineNum > 1) s.curveVertex(tile.lines.slice(-1)[0].endPos.x, tile.lines.slice(-1)[0].endPos.y);
	for (const line of tile.lines) drawLine(line, s);
	s.curveVertex(tile.lines[0].endPos.x, tile.lines[0].endPos.y);
	if (tile.lineNum > 1) s.curveVertex(tile.lines[1].endPos.x, tile.lines[1].endPos.y);
	s.endShape();
	s.pop();
	return false;
}

export const drawLineObj = (lineObj, s) => {
	for (const tile of lineObj.tiles) drawTile(tile, s);
}
