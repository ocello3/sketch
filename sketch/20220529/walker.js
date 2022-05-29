const setParams = (params, tab) => {
	params.walker = {
		step: 20,
		isProgressProb: 0.25,
	}
	const _param = params.walker;
	const _tab = tab.pages[1];
	_tab.addInput(_param, 'step', { step: 1, min: 1, max: 50 });
	_tab.addInput(_param, 'isProgressProb', { step: 0.1, min: 0.1, max: 0.5 });
	return false;
}

const calc = (preObj, params, s) => {
	const newObj = { ...preObj };
	const isInit = (s.frameCount === 1);
	const { step, isProgressProb } = params.walker;
	if (isInit) {
		preObj.pos = s.createVector(params.size * 0.5, params.size * 0.5);
	}
	const { pos } = preObj;
	newObj.dist = {
		above: pos.y,
		below: params.size - pos.y,
		left: pos.x,
		right: params.size - pos.x
	}
	newObj.rate = (() => {
		const calcRate = (dist, before = 0) => {
			const thisDist = s.map(dist, 0, params.size, 0, 0.5);
			return thisDist	+ before;
		}
		const above = calcRate(newObj.dist.above);
		const below = calcRate(newObj.dist.below, above);
		const left = calcRate(newObj.dist.left, below);
		const right = calcRate(newObj.dist.right, left);
		return {above, below, left, right};
	})();
	newObj.prob = Math.random();
	newObj.direction = (() => {
		if (newObj.prob < newObj.rate.above) return 'above';
		if (newObj.prob < newObj.rate.below) return 'below';
		if (newObj.prob < newObj.rate.left) return 'left';
		return 'right';
	})();
	newObj.progress = (() => {
		if (newObj.direction === 'above') return s.createVector(0, -1 * step);
		if (newObj.direction === 'below') return s.createVector(0, step);
		if (newObj.direction === 'left') return s.createVector(-1 * step, 0);
		if (newObj.direction === 'right') return s.createVector(step, 0);
		throw newObj.direction;
	})();
	newObj.prob2 = Math.random();
	newObj.isProgress = (newObj.prob2 < isProgressProb);
	newObj.pos = newObj.isProgress? p5.Vector.add(pos, newObj.progress): pos;
	newObj.prePos = pos;
	return newObj;
}

const draw = (obj, params, s) => {
	const { pos, prePos } = obj;
	s.push();
	s.line(prePos.x, prePos.y, pos.x, pos.y);
	s.pop();
}

export const walker = { setParams, calc, draw }
