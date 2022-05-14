export const setCircleParams = (params) => {
	params.circle = {
		gridPieceNum: 8,
		innerPointsNum: 6,
		outerPointsNum: 10,
		radiusRandRate: 0.6,
		pointsRadiusReducRate: 0.8,
	};
}

const calcPoints = (preGrid, newGrid, preCircleObj, newCircleObj, params, s) => (layer) => {
	const pointsNum = (layer === 'inner')? params.circle.innerPointsNum: params.circle.outerPointsNum;
	const calcPrePoints = () => {
		if (preCircleObj.isInit) return Array.from(Array(pointsNum), () => 1);
		if (layer === 'inner') return preGrid.innerPoints;
		if (layer === 'outer') return preGrid.outerPoints;
		throw layer;
	}
	const prePoints = calcPrePoints();
	const newPoints = prePoints.map((_, pointIndex) => {
		const newPoint = {};
		const calcPos = () => {
			const baseRadiusRate = (pointIndex % 2 === 0)? 0.3: 0.5;
			const radiusBase = newCircleObj.gridSize * params.circle.pointsRadiusReducRate * baseRadiusRate;
			const randRadius = radiusBase * (1 - params.circle.pointsRadiusReducRate) + radiusBase * params.circle.pointsRadiusReducRate * s.noise(newGrid.centerPos.x, newGrid.centerPos.y, s.frameCount*0.1);
			const x = newGrid.centerPos.x + randRadius * Math.cos(newGrid.pointsAngleInterval * pointIndex);
			const y = newGrid.centerPos.y + randRadius * Math.sin(newGrid.pointsAngleInterval * pointIndex);
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
		newGrid.pointsAngleInterval = Math.PI * 2 / params.circle.outerPointsNum;
		const newPointsFunc = calcPoints(preGrid, newGrid, preCircleObj, newCircleObj, params, s);
		const newInnerPoints = newPointsFunc('inner');
		const newOuterPoints = newPointsFunc('outer');
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
	s.fill(255, 0, 0, 50); // conver to variance
	for (const grid of circleObj.grids) drawPoints(grid.outerPoints, s);
	s.fill(0, 0, 255, 50);
	for (const grid of circleObj.grids) drawPoints(grid.innerPoints, s);
	s.pop();
}
