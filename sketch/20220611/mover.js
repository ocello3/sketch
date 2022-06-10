const init = (params, s, tab) => {
	params.mover = {
		num: 500,
	}
	const _param = params.mover;
	const _tab = tab.pages[1];
	// _tab.addInput(_param, 'step', { step: 1, min: 1, max: 50 }); //
	const moverObj = {};
	const { num } = _param;
	moverObj.movers = Array.from(Array(num), () => {
		const mover = {};
		return mover;
	});
	return moverObj;
}

const update = (preObj, params, s) => {
	const newObj = { ...preObj };
	newObj.movers = preObj.movers.map((preMover) => {
		const newMover = { ...preMover };
		return newMover;
	});
	return newObj;
}

const draw = (obj, params, s) => {
	s.push();
	s.pop();
}

export const mover = { init, update, draw }
