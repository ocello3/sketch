// 3層目

export const setRippleParams = (params) => {
	const ripple = {};
	ripple.deformationRate = 0.25;
	params.ripple = ripple;
}

const setData = (dropsData) => (params, s) => {
	const data = {};
	data.status = 'wait'; // 'update' or 'reset'
	const calcPos = () => {
		const x = dropsData.pos.x;
		const y = params.drop.layerPosArray[2];
		return s.createVector(x, y);
	}
	data.pos = calcPos();
	return data;
}

export const setRipples = (dropsDataArray, params, s) => {
	const repples = {};
	// 水滴のデータ（drops.js）を用いて波紋のデータを生成する。
	repples.dataArray = dropsDataArray.map(dropsData => setData(dropsData)(params, s));
	return repples;
}

const updateData = (preData) => (dropsData) => {
	const newData = { ...preData };
	const updateStatus = () => {
		if (preData.status === 'wait') {
			if (dropsData.isCollisionArray[2] === false) return 'wait';
			if (dropsData.isCollisionArray[2] === true) return 'update';
			throw dropsData.isCollisionArray[2];
		}
		if (preData.status === 'update') {
			if (dropsData.isCollisionArray[2] === false) return 'update';
			if (dropsData.isCollisionArray[2] === true) return 'reset';
			throw dropsData.isCollisionArray[2];
		}
		if (preData.status === 'reset') return 'update';
		throw preData.status;
	}
	newData.status = updateStatus();
	return newData;
}

export const updateRipples = (preRipples, newDropsDataArray) => {
	const newRipples = { ...preRipples };
	newRipples.dataArray = preRipples.dataArray.map((preData, index) => updateData(preData)(newDropsDataArray[index]));
	return newRipples;
}
