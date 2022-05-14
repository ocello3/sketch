export const setCircleParams = (params) => {
	params.circle = {
		gridPieceNum: 3,
		pointsNum: 5,
		pointsRadiusReducRate: 0.5,
	};
}

const calcPoints = (preGrid, newGrid, preCircleObj, newCircleObj, params, s) => {
	const prePoints = preCircleObj.isInit ? Array.from(Array(params.pointsNum), () => 1) : preGrid.points;
	const newPoints = prePoints.map((_, pointIndex) => {
		const calcPos = () => {
			const radius = newCircleObj.gridSize * params.circle.pointsRadiusReducRate * 0.5;
			const x = newGrid.centerPos.x + radius * Math.cos(newGrid.pointsAngleInterval * pointIndex);
			const y = newGrid.centerPos.y + radius * Math.sin(newGrid.pointsAngleInterval * pointIndex);
			return s.createVector(x, y);
		}
		const newPoint = {
			pos: calcPos(),
		}
		return newPoint;
	});
	return newPoints;
}

const calcGrids = (preCircleObj, newCircleObj, params, s) => {
	const preGrids = preCircleObj.isInit? Array.from(Array(newCircleObj.gridNum), () => 1): preCircleObj.grids;
	return preGrids.map((preGrid, gridIndex) => {
		const calcId = () => {
			const x = Math.floor(gridIndex / params.circle.gridPieceNum);
			const y = gridIndex % params.circle.gridPieceNum;
			return s.createVector(x, y);
		}
		const id = preCircleObj.isInit? calcId(): preGrid.id;
		const calcOriginPos = () => {
			const x = id.x * newCircleObj.gridSize;
			const y = id.y * newCircleObj.gridSize;
			return s.createVector(x, y);
		}
		const originPos = preCircleObj.isInit? calcOriginPos(): preGrid.originPos;
		const calcInitCenterPos = () => {
			const x = originPos.x + newCircleObj.gridSize * 0.5;
			const y = originPos.y + newCircleObj.gridSize * 0.5;
			return s.createVector(x, y);
		}
		const updateCenterPos = () => {
			return preGrid.centerPos; // need to add
		}
		const centerPos = preCircleObj.isInit? calcInitCenterPos(): updateCenterPos();
		const pointsAngleInterval = Math.PI * 2 / params.circle.pointsNum;
		const newGrid = {
			id: id,
			originPos: originPos,
			centerPos: centerPos,
			pointsAngleInterval: pointsAngleInterval,
		}
		const newPoints = calcPoints(preGrid, newGrid, preCircleObj, newCircleObj, params, s);
		return { ...newGrid, points: newPoints };
	});
}

export const calcCircleObj = (preCircleObj, params, s) => {
	const gridNum = preCircleObj.isInit? Math.pow(params.circle.gridPieceNum, 2): preCircleObj.gridNum;
	const gridSize = preCircleObj.isInit? params.size / params.circle.gridPieceNum: preCircleObj.gridSize;
	const newCircleObj = {
		isInit: false,
		gridNum: gridNum,
		gridSize: gridSize,
	};
	const newGrids = calcGrids(preCircleObj, newCircleObj, params, s);
	return { ...newCircleObj, grids: newGrids };
}

export const drawCircleObj = (circleObj, s) => {
	for (const grid of circleObj.grids) {
		s.circle(grid.centerPos.x, grid.centerPos.y, 50);
	}
}
