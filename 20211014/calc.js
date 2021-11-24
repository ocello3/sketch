import { s } from './sketch.js';

export const getParams = () => {
	const canvasDiv = document.getElementById('sketch');
	return {
		num: 30,
		size: canvasDiv.clientWidth,
	}
}

const setXYindex = (index, params) => {
	const xIndex = index % params.num;
	const yIndex = Math.floor(index / params.num);
	return s.createVector(xIndex, yIndex);
}

const setPos = (params, xyIndex) => {
	const x = params.size / (params.num + 1) * (xyIndex.x + 1);
	const y = params.size / (params.num + 1) * (xyIndex.y + 1);
	return s.createVector(x, y);
}

const setColor = (pos, img) => {
	return img.get(pos.x, pos.y);
}

export const setObj = (index) => (params, img) => {
	const initObj = {};
	initObj.xyIndex = setXYindex(index, params);
	initObj.pos = setPos(params, initObj.xyIndex);
	initObj.frameCount = 0;
	initObj.text = index;
	initObj.color = setColor(initObj.pos, img);
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
	// testSetPos(params);
}
