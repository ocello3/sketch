const init = (params, s, tab) => {
	params.mover = {
		num: 5,
		gravity: 9.8,
		massMin: 10,
		massMax: 20,
		velXmax: 5,
		velYmax: 5,
		bufferRate: 0.95,
	}
	const _param = params.mover;
	const _tab = tab.pages[1];
	// _tab.addInput(_param, 'step', { step: 1, min: 1, max: 50 }); //
	const moverObj = {};
	const { num, gravity, massMin, massMax, velXmax, velYmax } = _param;
	moverObj.movers = Array.from(Array(num), () => {
		const mover = {};
		mover.mass = s.map(Math.random(), 0, 1, massMin, massMax);
		mover.gravityAcc = s.createVector(0, gravity / mover.mass);
		mover.initVel = (() => {
			const x = Math.random() * velXmax;
			const y = Math.random() * velYmax;
			return s.createVector(x, y);
		})();
		mover.acc = 0;
		mover.vel = mover.initVel;
		mover.pos = (() => {
			const x = Math.random() * params.size;
			const y = Math.random() * params.size;
			return s.createVector(x, y);
		})();
		return mover;
	});
	return moverObj;
}

const update = (preObj, params, s) => {
	const newObj = { ...preObj };
	newObj.movers = preObj.movers.map((preMover) => {
		const newMover = { ...preMover };
		const { bufferRate } = params.mover;
		newMover.acc = preMover.gravityAcc;
		const updatePos = (newVel) => p5.Vector.add(preMover.pos, newVel);
		const updateVel = (isXOver, isYOver) => {
			const newVel = p5.Vector.add(preMover.vel, newMover.acc);
			const x = isXOver? newVel.x * (-1): newVel.x;
			const y = isYOver? newVel.y * (-1) * bufferRate: newVel.y;
			return s.createVector(x, y);
		}
		newMover.vel = (() => {
			const newVel = updateVel(false, false);
			const newPos = updatePos(newVel);
			const isXOver = (newPos.x < 0 || newPos.x > params.size);
			const isYOver = (newPos.y > params.size);
			return updateVel(isXOver, isYOver);
		})();
		newMover.pos = (() => {
			const newPos = updatePos(newMover.vel);
			const check = (prop) => {
				if (prop === 'x' && newPos[prop] < 0) return 0;
				if (newPos[prop] > params.size) return params.size;
				return newPos[prop];
			}
			return s.createVector(check('x'), check('y'));
		})();
		return newMover;
	});
	return newObj;
}

const draw = (obj, params, s) => {
	s.push();
	for (const mover of obj.movers) {
		s.circle(mover.pos.x, mover.pos.y, 10);
	}
	s.pop();
}

export const mover = { init, update, draw }
