export const setCheckboxParams = (params, tab) => {
	params.checkbox = {
		mouseChangeProb: 0.01,
	};
	// tab.pages[1].addInput(params.circle, 'minCircleNum', { step: 1, min: 3, max: 15});
	return false;
}

export const calcCheckboxObj = (preCircleObj, params, s) => {
	const newCheckboxObj = {};
	newCheckboxObj.isInit = false;
	/*
	const newGrids = calcGrids(preCircleObj, newCircleObj, params, s);
	return { ...newCircleObj, grids: newGrids };
	*/
}
