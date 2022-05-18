export const setCircleParams = (params) => {
	params.circle = {
		gridPieceNum: 6,
		minCircleNum: 3,
		maxCircleNum: 20,
		angleChangeProb: 0.01,
		angleEasingF: 0.05,
	};
}

const calcCircles = (preGrid, newGrid, preCircleObj, newCircleObj, params, s) => {
	const newCircles = Array.from(Array(newCircleObj.circleNum), (_, circleIndex) => {
		const newCircle = {};
		const diff = newGrid.circleOffsetInterval * circleIndex;
		newCircle.radius = newCircleObj.gridSize * 0.66 - diff;
		const rotatedDiff = p5.Vector.rotate(s.createVector(diff, 0), newGrid.circleAngle);
		newCircle.centerPos = p5.Vector.add(newGrid.centerPos, rotatedDiff);
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
		const calcIsUpdateTargetAngle = () => {
			const p = Math.random();
			if (p < params.circle.angleChangeProb) return true;
			return false;
		}
		newGrid.isUpdateTargetAngle = calcIsUpdateTargetAngle();
		const calcCircleTargetAngle = () => {
			const p = Math.random();
			if (p < 0.25) { return Math.PI * 0.5 } // right
			else if (p < 0.5) { return Math.PI } // below
			else if (p < 0.75) { return Math.PI * 1.5 } // left
			else { return 0 }; // above
		}
		newGrid.circleTargetAngle = (preCircleObj.isInit || newGrid.isUpdateTargetAngle)? calcCircleTargetAngle(): preGrid.circleTargetAngle;
		const calcIsReverseRotate = () => {
			const diff = newGrid.circleTargetAngle - preGrid.circleAngle;
			return (Math.abs(diff) > Math.PI)? true: false;
		}
		newGrid.isReverseRotate = (preCircleObj.isInit || newGrid.isUpdateTargetAngle)? calcIsReverseRotate(): preGrid.isReverseRotate;
		const calcCircleAngle = () => {
			const diff = preGrid.circleAngle - newGrid.circleTargetAngle;
			const progress = newGrid.isReverseRotate? diff * params.circle.angleEasingF * (-1): diff * params.circle.angleEasingF;
			return preGrid.circleAngle + progress;
		}
		newGrid.circleAngle = preCircleObj.isInit? newGrid.circleTargetAngle: calcCircleAngle();
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
	newCircleObj.circleNum = Math.floor(s.map(mouseX, 0, params.size, params.circle.minCircleNum, params.circle.maxCircleNum));
	const newGrids = calcGrids(preCircleObj, newCircleObj, params, s);
	return { ...newCircleObj, grids: newGrids };
}

export const drawCircleObj = (circleObj, s) => {
	s.push();
	s.noStroke(0);
	s.fill(0, 15);
	for (const grid of circleObj.grids) {
		for (const circle of grid.circle) s.circle(circle.centerPos.x, circle.centerPos.y, circle.radius);
	}
	s.pop();
}
