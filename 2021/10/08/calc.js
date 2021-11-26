import { s } from './sketch.js';

export const getParams = () => {
	const canvasDiv = document.getElementById('sketch');
	return {
		num: 5,
		size: canvasDiv.clientWidth,
	}
}

const setPos = (index, params) => {
	const x = params.size / (params.num + 1) * (index + 1);
	const y = params.size / 2;
	return s.createVector(x, y);
}

const testSetPos = (params) => {
	for (let index = 0; index < params.num; index++) {
		const pos = setPos(index, params);
		const isXmin = pos.x > 0;
		console.assert(isXmin == true);
		const isXmax = pos.x < params.size;
		console.assert(isXmax == true);
		const isYmin = pos.y > 0;
		console.assert(isYmin == true);
		const isYmax = pos.y < params.size;
		console.assert(isYmax == true);
	}
}

export const setObj = (index) => (params) => {
	const initObj = {};
	initObj.pos = setPos(index, params);
	initObj.frameCount = 0;
	initObj.text = index;
	return initObj;
}

const updateText = (preText, newFrameCount, index) => {
	const isDivisible = (newFrameCount % (index + 101) == 0);
	return (isDivisible ? preText + index : preText);
}

export const updateObj = (preObj, index) => {
	const newObj =  { ...preObj };
	newObj.frameCount = preObj.frameCount + 1;
	newObj.text = updateText(preObj.text, newObj.frameCount, index);
	return newObj;
}

export const test = () => {
	const params = getParams();
	testSetPos(params);
}
