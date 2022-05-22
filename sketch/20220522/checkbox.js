export const setCheckboxParams = (params, tab) => {
	params.checkbox = {
		pieceNum: 20,
	};
	// tab.pages[1].addInput(params.circle, 'minCircleNum', { step: 1, min: 3, max: 15});
	return false;
}

const calcCheckboxes = (preCheckboxObj, newCheckboxObj, params, s) => {
	const preCheckboxes = preCheckboxObj.isInit? Array.from(Array(newCheckboxObj.num), () => 1): preCheckboxObj.checkboxes;
	const newCheckboxes = preCheckboxes.map((preCheckbox, checkboxIndex) => {
		const newCheckbox = {};
		const calcId = () => {
			const xId = checkboxIndex % params.checkbox.pieceNum;
			const yId = Math.floor(checkboxIndex / params.checkbox.pieceNum);
			return s.createVector(xId, yId);
		}
		newCheckbox.id = preCheckboxObj.isInit? calcId(): preCheckbox.id;
		const calcPosOffset = () => {
			const internalLength = (params.checkbox.pieceNum - 1) * newCheckboxObj.interval;
			const totalMargin = params.size - internalLength;
			return totalMargin * 0.5;
		}
		newCheckbox.posOffset = preCheckboxObj.isInit? calcPosOffset(): preCheckbox.posOffset;
		const calcPos = () => {
			const xPos = newCheckboxObj.interval * newCheckbox.id.x + newCheckbox.posOffset;
			const yPos = newCheckboxObj.interval * newCheckbox.id.y + newCheckbox.posOffset;
			return s.createVector(xPos, yPos);
		}
		newCheckbox.pos = preCheckboxObj.isInit? calcPos(): preCheckbox.pos;
		return newCheckbox;
	});
	return newCheckboxes;
}

export const calcCheckboxObj = (preCheckboxObj, params, s) => {
	const newCheckboxObj = {};
	newCheckboxObj.isInit = false;
	newCheckboxObj.num = preCheckboxObj.isInit? Math.pow(params.checkbox.pieceNum, 2): preCheckboxObj.num;
	newCheckboxObj.interval = preCheckboxObj.isInit? params.size / params.checkbox.pieceNum: preCheckboxObj.interval;
	const newCheckboxes = calcCheckboxes(preCheckboxObj, newCheckboxObj, params, s);
	return { ...newCheckboxObj, checkboxes: newCheckboxes };
}

export const updateCheckboxDoms = (pg, checkboxDoms, checkboxObj, params, s) => {
	checkboxDoms.forEach((checkboxDom, domIndex) => {
		const checkbox = checkboxObj.checkboxes[domIndex];
		checkboxDom.position(checkbox.pos.x, checkbox.pos.y);
		const color = s.color(pg.get(checkbox.pos.x, checkbox.pos.y));
		const bright = (s.red(color) + s.green(color) + s.blue(color)) * 0.33;
		if (bright < 0.5) {
			checkboxDom.checked(false);
		} else {
			checkboxDom.checked(true);
		}
	});
}