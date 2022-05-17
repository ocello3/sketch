export const setCircleParams = (params) => {
	params.circle = {
		gridPieceNum: 8,
		maxCircleNum: 20,
	};
}

const calcCircles = (preGrid, newGrid, preCircleObj, newCircleObj, params, s) => {
	const newCircles = Array.from(Array(newCircleObj.circleNum), (_, circleIndex) => {
		const newCircle = {};
		const diff = newGrid.circleOffsetInterval * circleIndex;
		const calcCenterPosOffset = () => {
			if (newGrid.circleDirection === 'above') return s.createVector(0, -diff);
			if (newGrid.circleDirection === 'below') return s.createVector(0, diff);
			if (newGrid.circleDirection === 'right') return s.createVector(diff, 0);
			if (newGrid.circleDirection === 'left') return s.createVector(-diff, 0);
			throw newGrid.circleDirection;
		}
		newCircle.centerPos = p5.Vector.add(newGrid.centerPos, calcCenterPosOffset());
		newCircle.radius = newCircleObj.gridSize * 0.66 - diff;
		return newCircle;
	});
	return newCircles;
} 

const calcGrids = (preCircleObj, newCircleObj, params, s) => {
	const preGrids = preCircleObj.isInit? Array.from(Array(newCircleObj.gridNum), () => 1): preCircleObj.grids;
	return preGrids.map((preGrid, gridIndex) => {
		const newGrid = {};
		const calcId = () => {
			const x = Math.floor(gridIndex / params.circle.gridPieceNum);
			const y = gridIndex % params.circle.gridPieceNum;
			return s.createVector(x, y);
		}
		newGrid.id = preCircleObj.isInit? calcId(): preGrid.id;
		const calcOriginPos = () => {
			const x = newGrid.id.x * newCircleObj.gridSize;
			const y = newGrid.id.y * newCircleObj.gridSize;
			return s.createVector(x, y);
		}
		newGrid.originPos = preCircleObj.isInit? calcOriginPos(): preGrid.originPos;
		newGrid.centerPos = p5.Vector.add(newGrid.originPos, s.createVector(newCircleObj.gridSize * 0.5, newCircleObj.gridSize * 0.5));
		const calcCircleDirection = () => {
			const p = Math.random();
			if (p < 0.25) { return 'right' }
			else if (p < 0.5) { return 'left' }
			else if (p < 0.75) { return 'above' }
			else { return 'below' };
		}
		newGrid.circleDirection = preCircleObj.isInit? calcCircleDirection(): preGrid.circleDirection;
		const calcCenterOffsetInterval = () => {
			const centerOffset = s.map(newCircleObj.mouseY, 0, params.size, 0, newCircleObj.gridSize * 0.66);
			return centerOffset / newCircleObj.circleNum;
		}
		newGrid.circleOffsetInterval = calcCenterOffsetInterval();
		const newCircles = calcCircles(preGrid, newGrid, preCircleObj, newCircleObj, params, s);
		return { ...newGrid, circle: newCircles };
	});
}

export const calcCircleObj = (preCircleObj, params, s, mouseX, mouseY) => {
	const newCircleObj = {};
	newCircleObj.isInit = false;
	newCircleObj.mouseX = mouseX;
	newCircleObj.mouseY = mouseY;
	newCircleObj.gridNum = preCircleObj.isInit? Math.pow(params.circle.gridPieceNum, 2): preCircleObj.gridNum;
	newCircleObj.gridSize = preCircleObj.isInit? params.size / params.circle.gridPieceNum: preCircleObj.gridSize;
	newCircleObj.circleNum = Math.floor(s.map(mouseX, 0, params.size, 1, params.circle.maxCircleNum));
	const newGrids = calcGrids(preCircleObj, newCircleObj, params, s);
	return { ...newCircleObj, grids: newGrids };
}

export const drawCircleObj = (circleObj, s) => {
	s.push();
	s.stroke(0);
	s.noFill();
	for (const grid of circleObj.grids) {
		for (const circle of grid.circle) s.circle(circle.centerPos.x, circle.centerPos.y, circle.radius);
	}
	s.pop();
}
