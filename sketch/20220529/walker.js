const setParams = (params, tab) => {
	params.walker = {
		num: 10,
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
	const { num, step, isProgressProb } = params.walker;
	const isInit = (s.frameCount === 1);
	if (isInit) {
		preObj = {};
		preObj.walkers = Array.from(Array(num), () => false);
	}
	const newObj = { ...preObj };
	newObj.walkers = preObj.walkers.map((preWalker, walkerIndex) => {
		if (isInit) {
			preWalker = {};
			preWalker.pos = s.createVector(params.size * 0.5, params.size * 0.5);
		}
		const newWalker = { ...preWalker };
		const { pos } = preWalker;
		newWalker.dist = {
			above: pos.y,
			below: params.size - pos.y,
			left: pos.x,
			right: params.size - pos.x
		}
		newWalker.rate = (() => {
			const calcRate = (dist, before = 0) => {
				const thisDist = s.map(dist, 0, params.size, 0, 0.5);
				return thisDist + before;
			}
			const above = calcRate(newWalker.dist.above);
			const below = calcRate(newWalker.dist.below, above);
			const left = calcRate(newWalker.dist.left, below);
			const right = calcRate(newWalker.dist.right, left);
			return { above, below, left, right };
		})();
		newWalker.prob = Math.random();
		newWalker.direction = (() => {
			if (newWalker.prob < newWalker.rate.above) return 'above';
			if (newWalker.prob < newWalker.rate.below) return 'below';
			if (newWalker.prob < newWalker.rate.left) return 'left';
			return 'right';
		})();
		newWalker.progress = (() => {
			if (newWalker.direction === 'above') return s.createVector(0, -1 * step);
			if (newWalker.direction === 'below') return s.createVector(0, step);
			if (newWalker.direction === 'left') return s.createVector(-1 * step, 0);
			if (newWalker.direction === 'right') return s.createVector(step, 0);
			throw newWalker.direction;
		})();
		newWalker.prob2 = Math.random();
		newWalker.isProgress = (newWalker.prob2 < isProgressProb);
		newWalker.pos = newWalker.isProgress ? p5.Vector.add(pos, newWalker.progress) : pos;
		newWalker.prePos = pos;
		return newWalker;
	});
	return newObj;
}

const draw = (obj, params, s) => {
	s.push();
	s.noFill();
	// s.beginShape();
	for (const walker of obj.walkers) {
		const { pos, prePos } = walker;
		s.stroke(0);
		// s.curveVertex(prePos.x, prePos.y);
		// s.curveVertex(pos.x, pos.y);
		s.line(prePos.x, prePos.y, pos.x, pos.y);
	}
	// s.endShape();
	s.pop();
}

export const walker = { setParams, calc, draw }
