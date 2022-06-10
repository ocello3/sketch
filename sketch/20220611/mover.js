const init = (params, s, tab) => {
	params.mover = {
		num: 10,
		velXmax: 20,
		velYmax: 20,
	}
	const _param = params.mover;
	const _tab = tab.pages[1];
	// _tab.addInput(_param, 'step', { step: 1, min: 1, max: 50 }); //
	const moverObj = {};
	const { num, velXmax, velYmax } = _param;
	moverObj.movers = Array.from(Array(num), () => {
		const mover = {};
		mover.constVel = (() => {
			const x = Math.random() * velXmax;
			const y = Math.random() * velYmax;
			return s.createVector(x, y);
		})();
		mover.vel = mover.constVel;
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
		const updatePos = (constVel) => {
			const newVel = constVel;
			return p5.Vector.add(preMover.pos, newVel);
		}
		newMover.constVel = (() => {
			// collision check
			const newPos = updatePos(preMover.constVel);
			const isXOver = (newPos.x < 0 || newPos.x > params.size);
			const isYOver = (newPos.y < 0 || newPos.y > params.size);
			if (!isXOver && !isYOver) return preMover.constVel; // not collided
			// collided
			const x = isXOver? preMover.constVel.x * (-1): preMover.constVel.x;
			const y = isYOver? preMover.constVel.y * (-1): preMover.constVel.y;
			return s.createVector(x, y);
		})();
		newMover.pos = updatePos(newMover.constVel);
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
