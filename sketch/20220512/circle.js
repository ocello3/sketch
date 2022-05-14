export const setCircleParams = (params) => {
	params.circle = {
		gridPieceNum: 10,
		innerPointsNum: 3,
		outerPointsNum: 5,
		pointsRadiusReducRate: 0.7,
	};
}

const calcInnerPoints = (preGrid, newGrid, preCircleObj, newCircleObj, params, s) => {
	const preInnerPoints = preCircleObj.isInit ? Array.from(Array(params.circle.innerPointsNum), () => 1) : preGrid.innerPoints;
	const newInnerPoints = preInnerPoints.map((_, pointIndex) => {
		const newInnerPoint = {};
		const calcPos = () => {
			const radius = newCircleObj.gridSize * params.circle.pointsRadiusReducRate * 0.5;
			const x = newGrid.centerPos.x + radius * Math.cos(newGrid.pointsAngleInterval * pointIndex);
			const y = newGrid.centerPos.y + radius * Math.sin(newGrid.pointsAngleInterval * pointIndex);
			return s.createVector(x, y);
		}
		newInnerPoint.pos = calcPos();
		return newInnerPoint;
	});
	return newInnerPoints;
}

const calcOuterPoints = (preGrid, newGrid, preCircleObj, newCircleObj, params, s) => {
	const preOuterPoints = preCircleObj.isInit ? Array.from(Array(params.circle.outerPointsNum), () => 1) : preGrid.outerPoints;
	const newOuterPoints = preOuterPoints.map((_, pointIndex) => {
		const newOuterPoint = {};
		const calcPos = () => {
			const radius = newCircleObj.gridSize * params.circle.pointsRadiusReducRate * 0.5;
			const x = newGrid.centerPos.x + radius * Math.cos(newGrid.pointsAngleInterval * pointIndex);
			const y = newGrid.centerPos.y + radius * Math.sin(newGrid.pointsAngleInterval * pointIndex);
			return s.createVector(x, y);
		}
		newOuterPoint.pos = calcPos();
		return newOuterPoint;
	});
	return newOuterPoints;
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
		newGrid.pointsAngleInterval = Math.PI * 2 / params.circle.outerPointsNum;
		const newInnerPoints = calcInnerPoints(preGrid, newGrid, preCircleObj, newCircleObj, params, s);
		const newOuterPoints = calcOuterPoints(preGrid, newGrid, preCircleObj, newCircleObj, params, s);
		return { ...newGrid, innerPoints: newInnerPoints, outerPoints: newOuterPoints };
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

const drawPoints = (points, s) => {
	s.beginShape();
	s.curveVertex(points.slice(-1)[0].pos.x, points.slice(-1)[0].pos.y);
	for (const point of points) {
		s.curveVertex(point.pos.x, point.pos.y);
	}
	s.curveVertex(points[0].pos.x, points[0].pos.y);
	s.curveVertex(points[1].pos.x, points[1].pos.y);
	s.endShape();
}

export const drawCircleObj = (circleObj, s) => {
	s.push();
	s.noStroke();
	s.fill(255, 0, 0, 50);
	for (const grid of circleObj.grids) drawPoints(grid.innerPoints, s);
	s.fill(0, 0, 255, 50);
	for (const grid of circleObj.grids) drawPoints(grid.outerPoints, s);
	s.pop();
}
