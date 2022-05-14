export const setCircleParams = (params) => {
	params.circle = {
		gridPieceNum: 3,
		pointsNum: 5,
		pointsRadiusReducRate: 0.5,
	};
}

const calcPoints = (preGrid, newGrid, preCircleObj, newCircleObj, params, s) => {
	const prePoints = preCircleObj.isInit ? Array.from(Array(params.circle.pointsNum), () => 1) : preGrid.points;
	const newPoints = prePoints.map((_, pointIndex) => {
		const newPoint = {};
		const calcPos = () => {
			const radius = newCircleObj.gridSize * params.circle.pointsRadiusReducRate * 0.5;
			const x = newGrid.centerPos.x + radius * Math.cos(newGrid.pointsAngleInterval * pointIndex);
			const y = newGrid.centerPos.y + radius * Math.sin(newGrid.pointsAngleInterval * pointIndex);
			return s.createVector(x, y);
		}
		newPoint.pos = calcPos();
		return newPoint;
	});
	return newPoints;
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
		const calcInitCenterPos = () => {
			const x = newGrid.originPos.x + newCircleObj.gridSize * 0.5;
			const y = newGrid.originPos.y + newCircleObj.gridSize * 0.5;
			return s.createVector(x, y);
		}
		const updateCenterPos = () => {
			return preGrid.centerPos; // need to add
		}
		newGrid.centerPos = preCircleObj.isInit? calcInitCenterPos(): updateCenterPos();
		newGrid.pointsAngleInterval = Math.PI * 2 / params.circle.pointsNum;
		const newPoints = calcPoints(preGrid, newGrid, preCircleObj, newCircleObj, params, s);
		return { ...newGrid, points: newPoints };
	});
}

export const calcCircleObj = (preCircleObj, params, s) => {
	const newCircleObj = {};
	newCircleObj.isInit = false;
	newCircleObj.gridNum = preCircleObj.isInit? Math.pow(params.circle.gridPieceNum, 2): preCircleObj.gridNum;
	newCircleObj.gridSize = preCircleObj.isInit? params.size / params.circle.gridPieceNum: preCircleObj.gridSize;
	const newGrids = calcGrids(preCircleObj, newCircleObj, params, s);
	return { ...newCircleObj, grids: newGrids };
}

export const drawCircleObj = (circleObj, s) => {
	for (const grid of circleObj.grids) {
		s.beginShape();
		s.curveVertex(grid.points.slice(-1)[0].pos.x, grid.points.slice(-1)[0].pos.y);
		for (const point of grid.points) {
			s.curveVertex(point.pos.x, point.pos.y);
		}
		s.curveVertex(grid.points[0].pos.x, grid.points[0].pos.y);
		s.curveVertex(grid.points[1].pos.x, grid.points[1].pos.y);
		s.endShape();
	}
}
