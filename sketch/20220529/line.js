const setParams = (params, tab) => {
	params.line = {
	}
	const _param = params.line;
	const _tab = tab.pages[1];
	// _tab.addInput(_param, 'interval', { min: 0, max: 5 }); /
	return false;
}

const calc = (preObj, params, s) => {
	const newObj = { ...preObj };
	const isInit = (s.frameCount === 0);
	// const { interval, gapRate } = params.line; /
	if (isInit) {
	}
	return newObj;
}

const draw = (obj, params, s) => {
	s.push();
	s.pop();
}

export const line = { setParams, calc, draw }
